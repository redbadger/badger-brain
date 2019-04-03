/* eslint-disable no-console, max-len */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import blogPostFixtures from '../../test/fixtures/blog-posts.json';

const mockfetch = {
  fetchAllBlogPosts: () => blogPostFixtures.data.allBlogPosts,
  fetchBlogPost: args => {
    if (args.id) {
      return blogPostFixtures.data.allBlogPosts.find(
        blogPost => blogPost.id === args.id
      );
    }
    if (args.title) {
      return blogPostFixtures.data.allBlogPosts.find(
        blogPost => blogPost.title === args.title
      );
    }
    if (args.title && args.id) {
      return blogPostFixtures.data.allBlogPosts.find(
        blogPost => blogPost.title === args.title && blogPost.id === args.id
      );
    }
    return null;
  },
};

const BlogPostFields = injectr('../../lib/blogPost/blogPostFields.js', {
  '../fetch': mockfetch,
});

const BlogPostSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: BlogPostFields.BlogPostSchemaFields,
  }),
});

describe('Blog Post Queries', () => {
  it('should be able to get all available blog posts', async () => {
    const query = `
    query {
      allBlogPosts {
        id
        title
        state
        url
        author
        author_at
        author_email
        author_name
        blog_author {
          id
          display_name
          email
          gravatar_url
          slug
        }
        campaign
        campaign_name
        meta_description
        post_body
        post_list_content
        post_summary
        tag_ids
      }
    }
    `;

    const result = await graphql(BlogPostSchema, query);

    expect(result.data).to.deep.equal(blogPostFixtures.data);
  });

  it('should be able to get single blog post based on ID', async () => {
    const query = `
    query {
      blogPost(id: 8480429300) {
        id
        title
        state
        url
        author
        author_at
        author_email
        author_name
        blog_author {
          id
          display_name
          email
          gravatar_url
          slug
        }
        campaign
        campaign_name
        meta_description
        post_body
        post_list_content
        post_summary
        tag_ids
      }
    }
    `;

    const result = await graphql(BlogPostSchema, query);

    expect(result.data).to.deep.equal({
      blogPost: blogPostFixtures.data.allBlogPosts[0],
    });
  });

  it('should be able to get single blog post based on Title', async () => {
    const query = `
    query {
      blogPost(title: "Why don’t you have a monorepo?") {
        id
        title
        state
        url
        author
        author_at
        author_email
        author_name
        blog_author {
          id
          display_name
          email
          gravatar_url
          slug
        }
        campaign
        campaign_name
        meta_description
        post_body
        post_list_content
        post_summary
        tag_ids
      }
    }
    `;

    const result = await graphql(BlogPostSchema, query);

    console.log(1, result.data);
    console.log(2, blogPostFixtures.data.allBlogPosts[1]);

    expect(result.data).to.deep.equal({
      blogPost: blogPostFixtures.data.allBlogPosts[1],
    });
  });
});
