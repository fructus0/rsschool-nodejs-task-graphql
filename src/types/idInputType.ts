import { GraphQLNonNull, GraphQLString } from 'graphql/type';

export const IdInputType = new GraphQLNonNull(GraphQLString);
