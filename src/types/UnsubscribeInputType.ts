import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql/type';

export const UnsubscribeInputType = new GraphQLInputObjectType({
  name: 'UnsubscribeInputType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    userUnsubscribeFromId: { type: new GraphQLNonNull(GraphQLString) },
  },
});
