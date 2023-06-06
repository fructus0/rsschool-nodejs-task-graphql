import { GraphQLInputObjectType, GraphQLString } from 'graphql/type';

export const UpdatePostInputType = new GraphQLInputObjectType({
  name: 'UpdatePostInputType',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});
