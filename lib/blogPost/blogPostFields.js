import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { fetchBlogPost, fetchAllBlogPosts } from '../fetch';

const BlogAuthor = new GraphQLObjectType({
  name: 'BlogAuthor',
  fields: {
    id: {
      type: GraphQLFloat,
      description: 'The id of the blog author',
    },
    displayName: {
      type: GraphQLString,
      description: 'The display name of the blog author',
    },
    email: {
      type: GraphQLString,
      description: 'The email of the blog author',
    },
    gravatarUrl: {
      type: GraphQLString,
      description: 'The gravatar url of the blog author',
    },
    slug: {
      type: GraphQLString,
      description:
        'The slug of the blog author, this corresponds the authors badger profile slug',
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
    name: {
      type: GraphQLString,
      description: 'The name of the blog post',
    },
    slug: {
      type: GraphQLString,
      description: 'The slug of the blog post',
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
    authorAt: {
      type: GraphQLFloat,
      description: 'Time the post was published',
    },
    authorEmail: {
      type: GraphQLString,
      description:
        'The email of the person who finally published the post, not who originally wrote it',
    },
    authorName: {
      type: GraphQLString,
      description:
        'The person who finally published the post, not who originally wrote it',
    },
    blogAuthor: {
      type: BlogAuthor,
      description: 'The person who actually wrote the blog',
    },
    campaign: {
      type: GraphQLString,
      description:
        'The id for the campaign this blog post is attached to (optional)',
    },
    campaignName: {
      type: GraphQLString,
      description:
        'The name for the campaign this blog post is attached to (optional)',
    },
    metaDescription: {
      type: GraphQLString,
      description: 'The meta description of the blog post',
    },
    postBody: {
      type: GraphQLString,
      description: 'The stringified HTML content of the blog post',
    },
    postListContent: {
      type: GraphQLString,
      description:
        'The stringified HTML content of the listing of the blog post',
    },
    postSummary: {
      type: GraphQLString,
      description: 'The stringified HTML summary of the blog post',
    },
    tagIds: {
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
      name: {
        type: GraphQLString,
        description: `Returns the posts that match the name value.
            Supports exact, contains, icontains, ne lookups`,
      },
      slug: {
        type: GraphQLString,
        description: 'Returns the posts that match a particular slug value',
      },
    },
    resolve: (source, args) => fetchBlogPost(args),
  },
  allBlogPosts: {
    type: new GraphQLList(BlogPostType),
    description: 'Request a list of blog posts',
    args: {
      limit: {
        type: GraphQLInt,
        description: 'The number of items to return. Defaults to 20',
      },
      offset: {
        type: GraphQLInt,
        description:
          'The offset set to start returning rows from. Defaults to 0',
      },
      state: {
        type: GraphQLString,
        description: 'DRAFT, PUBLISHED, or SCHEDULED',
      },
      campaign: {
        type: GraphQLFloat,
        description: `Returns the posts that match the campaign guid.
           The campaign guid can be found in the campaign dashboard URL
           (e.g. https://app.hubspot.com/campaigns/:portal_id/#/details/:campaign_guid)`,
      },
      blogAuthorId: {
        type: GraphQLFloat,
        description:
          'Returns the posts that match a particular blog author ID value',
      },
      name: {
        type: GraphQLString,
        description: `Returns the posts that match the name value.
            Supports exact, contains, icontains, ne lookups`,
      },
    },
    resolve: (source, args) => fetchAllBlogPosts(args),
  },
};
