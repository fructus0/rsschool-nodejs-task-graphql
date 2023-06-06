import {
  GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
} from 'graphql/type';

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInputType',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
  },
});
