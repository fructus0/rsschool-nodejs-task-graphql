import { FastifyInstance } from 'fastify';

import { GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import { MemberTypeEntity } from '../../entities/memberType.entity';
import { UserEntity } from '../../entities/user.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { PostEntity } from '../../entities/post.entity';
import { Validator } from '../../validation/baseValidator';
import { CreatePostInputType } from '../../types/createPostInputType';
import { IdInputType } from '../../types/idInputType';
import { CreateUserInputType } from '../../types/createUserInputType';
import { CreateProfileInputType } from '../../types/createProfileInputType';
import { UpdateUserInputType } from '../../types/updateUserInputType';
import { UpdateProfileInputType } from '../../types/updateProfileInputType';
import { UpdatePostInputType } from '../../types/updatePostInputType';
import { UpdateMemberTypeInputType } from '../../types/updateMemberTypeInputType';
import { UnsubscribeInputType } from '../../types/UnsubscribeInputType';
import { SubscribeInputType } from '../../types/SubscribeInputType';

export const getRequestSchema = (fastify: FastifyInstance) => new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      memberTypes: {
        type: new GraphQLList(MemberTypeEntity),
        resolve: () => fastify.db.memberTypes.findMany(),
      },
      users: {
        type: new GraphQLList(UserEntity),
        resolve: () => fastify.db.users.findMany(),
      },
      profiles: {
        type: new GraphQLList(ProfileEntity),
        resolve: () => fastify.db.profiles.findMany(),
      },
      posts: {
        type: new GraphQLList(PostEntity),
        resolve: () => fastify.db.posts.findMany(),
      },
      memberType: {
        type: MemberTypeEntity,
        args: {
          id: { type: IdInputType },
        },
        resolve: async (_, { id }) => {
          const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: id });

          Validator.existenceValidation(memberType, fastify, 'MemberType not found.', false);

          return memberType;
        },
      },
      user: {
        type: UserEntity,
        args: {
          id: { type: IdInputType },
        },
        resolve: async (_, { id }) => {
          Validator.uuidValidation(id, fastify);

          const user = await fastify.db.users.findOne({ key: 'id', equals: id });

          Validator.existenceValidation(user, fastify, 'User not found.', false);

          return user;
        },
      },
      profile: {
        type: ProfileEntity,
        args: {
          id: { type: IdInputType },
        },
        resolve: async (_, { id }) => {
          Validator.uuidValidation(id, fastify);

          const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });

          Validator.existenceValidation(profile, fastify, 'Profile not found.', false);

          return profile;
        },
      },
      post: {
        type: PostEntity,
        args: {
          id: { type: IdInputType },
        },
        resolve: async (_, { id }) => {
          Validator.uuidValidation(id, fastify);

          const post = await fastify.db.posts.findOne({ key: 'id', equals: id });

          Validator.existenceValidation(post, fastify, 'Post not found', false);

          return post;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: {
      createUser: {
        type: UserEntity,
        args: {
          body: {
            type: CreateUserInputType,
          },
        },
        resolve: async (_, { body }) => fastify.db.users.create(body),
      },
      createProfile: {
        type: ProfileEntity,
        args: {
          body: {
            type: CreateProfileInputType,
          },
        },
        resolve: async (_, { body }) => {
          Validator.uuidValidation(body.userId, fastify);

          const user = await fastify.db.users.findOne({ key: 'id', equals: body.userId });
          const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: body.memberTypeId });

          Validator.existenceValidation(user, fastify, 'User not found.', true);
          Validator.existenceValidation(memberType, fastify, 'MemberType not found.', true);

          return fastify.db.profiles.create(body);
        },
      },
      createPost: {
        type: PostEntity,
        args: {
          body: {
            type: CreatePostInputType,
          },
        },
        resolve: async (_, { body }) => {
          Validator.uuidValidation(body.userId, fastify);

          const user = await fastify.db.users.findOne({ key: 'id', equals: body.userId });

          Validator.existenceValidation(user, fastify, 'User not found.', true);

          return fastify.db.posts.create(body);
        },
      },
      updateUser: {
        type: UserEntity,
        args: {
          id: { type: IdInputType },
          body: {
            type: UpdateUserInputType,
          },
        },
        resolve: async (_, { id, body }) => {
          Validator.uuidValidation(id, fastify);

          try {
            return await fastify.db.users.change(id, body);
          } catch {
            throw fastify.httpErrors.notFound('Bad request.');
          }
        },
      },
      updateProfile: {
        type: ProfileEntity,
        args: {
          id: { type: IdInputType },
          body: {
            type: UpdateProfileInputType,
          },
        },
        resolve: async (_, { id, body }) => {
          Validator.uuidValidation(id, fastify);

          const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: body.memberTypeId });

          Validator.existenceValidation(memberType, fastify, 'MemberType not found.', true);

          try {
            return await fastify.db.profiles.change(id, body);
          } catch {
            throw fastify.httpErrors.badRequest('Bad request.');
          }
        },
      },
      updatePost: {
        type: PostEntity,
        args: {
          id: { type: IdInputType },
          body: {
            type: UpdatePostInputType,
          },
        },
        resolve: async (_, { id, body }) => {
          Validator.uuidValidation(id, fastify);

          try {
            return await fastify.db.posts.change(id, body);
          } catch {
            throw fastify.httpErrors.badRequest('Bad request.');
          }
        },
      },
      updateMemberType: {
        type: MemberTypeEntity,
        args: {
          id: { type: IdInputType },
          body: {
            type: UpdateMemberTypeInputType,
          },
        },
        resolve: async (_, { id, body }) => {
          try {
            return await fastify.db.memberTypes.change(id, body);
          } catch {
            throw fastify.httpErrors.badRequest('Bad request.');
          }
        },
      },
      subscribeUserTo: {
        type: UserEntity,
        args: {
          body: { type: SubscribeInputType },
        },
        resolve: async (_, { body }) => {
          const { id, userSubscribeToId } = body;

          Validator.sameUserIdsValidation(id, userSubscribeToId, fastify, 'User cannot subscribe to himself');
          Validator.uuidValidation(id, fastify);
          Validator.uuidValidation(userSubscribeToId, fastify);

          const currentUser = await fastify.db.users.findOne({ key: 'id', equals: id });
          const targetUser = await fastify.db.users.findOne({ key: 'id', equals: userSubscribeToId });

          Validator.existenceValidation(currentUser, fastify, 'User not found.', true);
          Validator.existenceValidation(targetUser, fastify, 'User not found.', true);
          Validator.userAlreadySubscribedValidation(currentUser!, targetUser!, fastify);

          return fastify.db.users.change(userSubscribeToId, {
            subscribedToUserIds: [...targetUser!.subscribedToUserIds, currentUser!.id],
          });
        },
      },
      unsubscribeUserFrom: {
        type: UserEntity,
        args: {
          body: { type: UnsubscribeInputType },
        },
        resolve: async (_, { body }) => {
          const { id, userUnsubscribeFromId } = body;

          Validator.sameUserIdsValidation(id, userUnsubscribeFromId, fastify, 'User cannot unsubscribe himself');
          Validator.uuidValidation(id, fastify);
          Validator.uuidValidation(userUnsubscribeFromId, fastify);

          const currentUser = await fastify.db.users.findOne({ key: 'id', equals: id });
          const targetUser = await fastify.db.users.findOne({ key: 'id', equals: userUnsubscribeFromId });

          Validator.existenceValidation(currentUser, fastify, 'User not found.', true);
          Validator.existenceValidation(targetUser, fastify, 'User not found.', true);
          Validator.userHasNoSubscribeToUserValidation(currentUser!, targetUser!, fastify);

          return fastify.db.users.change(userUnsubscribeFromId, {
            subscribedToUserIds: targetUser!.subscribedToUserIds.filter(
              (userId) => userId !== currentUser!.id,
            ),
          });
        },
      },
    },
  }),
});
