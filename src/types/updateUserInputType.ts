import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql/type';

export const UpdateUserInputType = new GraphQLNonNull(new GraphQLInputObjectType({
  name: 'UpdateUserInputType',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
}));
