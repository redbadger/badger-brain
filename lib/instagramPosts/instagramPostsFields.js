import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import fetchAllInstagramPosts from '../fetch/instagram';

const InstagramPostImage = new GraphQLObjectType({
  name: 'instagramPostImage',
  fields: {
    url: {
      type: GraphQLString,
      description: 'THe url for the image',
    },
    width: {
      type: GraphQLInt,
      description: 'The width dimension of the image',
    },
    height: {
      type: GraphQLInt,
      description: 'The height dimension of the image',
    },
  },
});

const InstagramPost = new GraphQLObjectType({
  name: 'instagramPost',
  fields: {
    text: {
      type: GraphQLString,
      description: 'The accompanying comment on the post',
    },
    link: { type: GraphQLString, description: 'A direct link to the post' },
    image: {
      type: InstagramPostImage,
      description: 'The associated image for the post',
    },
    comments: {
      type: GraphQLInt,
      description: 'The comment count',
    },
    likes: {
      type: GraphQLInt,
      description: 'The like count',
    },
    created: {
      type: GraphQLString,
      description: 'Datetime string of when the post was posted',
    },
  },
});

export const InstagramPostSchemaFields = {
  allInstagramPosts: {
    type: new GraphQLList(InstagramPost),
    description: 'Request all instagram posts for Red Badger',
    resolve: fetchAllInstagramPosts,
  },
};
