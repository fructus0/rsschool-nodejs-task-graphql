import { GraphQLObjectType, GraphQLString } from 'graphql/type';

export const PostEntity = new GraphQLObjectType({
  name: 'PostEntity',
  fields: {
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});
