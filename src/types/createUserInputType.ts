import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql/type';

export const CreateUserInputType = new GraphQLNonNull(new GraphQLInputObjectType({
  name: 'CreateUserInputType',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
}));
