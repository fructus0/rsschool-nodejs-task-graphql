import {
  GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull,
} from 'graphql/type';

export const UpdateMemberTypeInputType = new GraphQLNonNull(new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInputType',
  fields: {
    discount: { type: GraphQLFloat },
    monthPostsLimit: { type: GraphQLInt },
  },
}));
