import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql/type';

export const CreatePostInputType = new GraphQLNonNull(new GraphQLInputObjectType({
  name: 'CreatePostInputType',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
}));
