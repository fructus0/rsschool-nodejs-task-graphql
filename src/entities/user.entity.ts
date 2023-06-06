import {
  GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLString,
} from 'graphql/type';
import { FastifyInstance } from 'fastify';
import { PostEntity } from './post.entity';
import { ProfileEntity } from './profile.entity';
import { MemberTypeEntity } from './memberType.entity';
import type { UserEntity as DBUserEntity } from '../utils/DB/entities/DBUsers';

export const UserEntity: GraphQLOutputType = new GraphQLObjectType({
  name: 'UserEntity',
  // We need callback here, to access UserEntity in itself. https://graphql.org/graphql-js/type/#example-6
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    memberType: {
      type: MemberTypeEntity || null,
      resolve: async (source, _, fastify: FastifyInstance) => {
        const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: source.id });

        return userProfile ? fastify.db.memberTypes.findOne({ key: 'id', equals: userProfile.memberTypeId }) : null;
      },
    },
    profile: {
      type: ProfileEntity || null,
      resolve: async (source, _, fastify: FastifyInstance) => fastify.db.profiles.findOne({
        key: 'userId',
        equals: source.id,
      }),
    },
    posts: {
      type: new GraphQLList(PostEntity),
      resolve: async (source, _, fastify: FastifyInstance) => fastify.db.posts.findMany({
        key: 'userId',
        equals: source.id,
      }),
    },
    subscribedToUser: {
      type: new GraphQLList(UserEntity),
      resolve: async (source, _, fastify: FastifyInstance) => {
        const resultArray: DBUserEntity[] = [];

        for (const id of source.subscribedToUserIds) {
          const user = await fastify.db.users.findOne({ key: 'id', equals: id });

          if (user) {
            resultArray.push(user);
          }
        }

        return resultArray;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserEntity),
      resolve: async (source, _, fastify: FastifyInstance) => fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: source.id,
      }),
    },
  }),
});
