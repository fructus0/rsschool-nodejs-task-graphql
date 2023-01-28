import {
  GraphQLFloat, GraphQLInt, GraphQLObjectType, GraphQLString,
} from 'graphql/type';

export const memberTypeEntity = new GraphQLObjectType({
  name: 'MemberTypeEntity',
  fields: {
    id: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    monthPostsLimit: { type: GraphQLInt },
  },
});
