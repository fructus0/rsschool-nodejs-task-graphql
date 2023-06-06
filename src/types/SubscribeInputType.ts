import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql/type';

export const SubscribeInputType = new GraphQLInputObjectType({
  name: 'SubscribeInputType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    userSubscribeToId: { type: new GraphQLNonNull(GraphQLString) },
  },
});
