import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql/type';

export const ProfileEntity = new GraphQLObjectType({
  name: 'ProfileEntity',
  fields: {
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
  },
});
