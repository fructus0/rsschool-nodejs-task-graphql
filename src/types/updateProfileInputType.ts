import {
  GraphQLInputObjectType, GraphQLInt, GraphQLString,
} from 'graphql/type';

export const UpdateProfileInputType = new GraphQLInputObjectType({
  name: 'UpdateProfileInputType',
  fields: {
    memberTypeId: { type: GraphQLString },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
  },
});
