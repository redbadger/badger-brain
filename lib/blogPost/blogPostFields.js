import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import { fetchBlogPost, fetchAllBlogPosts } from '../fetch';

// Blogs can be sorted by campaign and tags
// Is it worth tracking campaigns through badgerbrain too?

// const CategoryType = new GraphQLObjectType({
//   name: 'Category',
//   fields: {
//     name: {
//       type: GraphQLString,
//       description: 'The name of the category',
//     },
//     slug: {
//       type: GraphQLString,
//       description: 'The slug of the category',
//     },
//     order: {
//       type: GraphQLFloat,
//       description: 'The order number of the category',
//     },
//   },
// });

const BlogAuthor = new GraphQLObjectType({
  name: 'BlogAuthor',
  fields: {
    id: {
      type: GraphQLFloat,
      description: 'The id of the blog author',
    },
    display_name: {
      type: GraphQLString,
      description: 'The display name of the blog author',
    },
    email: {
      type: GraphQLString,
      description: 'The email of the blog author',
    },
    gravatar_url: {
      type: GraphQLString,
      description: 'The gravatar url of the blog author',
    },
    slug: {
      type: GraphQLString,
      description: 'The slug of the blog author, this corresponds the authors badger profile slug',
    },
  },
});

export const BlogPostType = new GraphQLObjectType({
  name: 'BlogPost',
  fields: {
    id: {
      type: GraphQLFloat,
      description: 'The id of the blog post',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the blog post',
    },
    state: {
      type: GraphQLString,
      description:
        'The current state of the blog post, e.g. draft, archived, published.',
    },
    url: {
      type: GraphQLString,
      description: 'The url of the blog post',
    },
    author: {
      type: GraphQLString,
      description:
        'The person who finally published the post, not who originally wrote it',
    },
    author_at: {
      type: GraphQLFloat,
      description: 'Time the post was published',
    },
    author_email: {
      type: GraphQLString,
      description:
        'The email of the person who finally published the post, not who originally wrote it',
    },
    author_name: {
      type: GraphQLString,
      description:
        'The person who finally published the post, not who originally wrote it',
    },
    blog_author: {
      type: BlogAuthor,
      description:
        'The person who actually wrote the blog',
    },
    campaign: {
      type: GraphQLString,
      description: 'The id for the campaign this blog post is attached to (optional)',
    },
    campaign_name: {
      type: GraphQLString,
      description: 'The name for the campaign this blog post is attached to (optional)',
    },
    meta_description: {
      type: GraphQLString,
      description: 'The meta description of the blog post',
    },
    post_body: {
      type: GraphQLString,
      description: 'The stringified HTML content of the blog post',
    },
    post_list_content: {
      type: GraphQLString,
      description: 'The stringified HTML content of the listing of the blog post',
    },
    post_summary: {
      type: GraphQLString,
      description: 'The stringified HTML summary of the blog post',
    },
    tag_ids: {
      type: new GraphQLList(GraphQLFloat),
      description: 'The ids of tags attached to the blog post',
    },
  },
});

export const BlogPostSchemaFields = {
  blogPost: {
    type: BlogPostType,
    description: 'Request a blog by id or title',
    args: {
      id: { type: GraphQLFloat },
      title: { type: GraphQLString },
    },
    resolve: (source, args) => fetchBlogPost(args),
  },
  allBlogPosts: {
    type: new GraphQLList(BlogPostType),
    description: 'Request all badgers',
    resolve: fetchAllBlogPosts,
  },
};
