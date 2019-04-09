/* eslint-disable no-console, max-len */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import blogPostFixtures from '../../test/fixtures/blog-posts.json';

const mockfetch = {
  fetchAllBlogPosts: () => blogPostFixtures.data.allBlogPosts,
  fetchBlogPost: args => {
    if (args.slug && !args.name) {
      return blogPostFixtures.data.allBlogPosts.find(
        blogPost => blogPost.slug === args.slug
      );
    }
    if (args.name && !args.slug) {
      return blogPostFixtures.data.allBlogPosts.find(
        blogPost => blogPost.name === args.name
      );
    }
    if (args.name && args.slug) {
      return blogPostFixtures.data.allBlogPosts.find(
        blogPost => blogPost.name === args.name && blogPost.slug === args.slug
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
        name
        state
        url
        slug
        author
        authorAt
        authorEmail
        authorName
        blogAuthor {
          id
          displayName
          email
          gravatarUrl
          slug
        }
        campaign
        campaignName
        metaDescription
        postBody
        postListContent
        postSummary
        tagIds
      }
    }
    `;

    const result = await graphql(BlogPostSchema, query);

    expect(result.data).to.deep.equal(blogPostFixtures.data);
  });

  it('should be able to get single blog post based on ID', async () => {
    const query = `
    query {
      blogPost(slug: "apple-news-fresh-job-titles-and-tackling-loneliness-with-tech") {
        id
        name
        state
        url
        author
        slug
        authorAt
        authorEmail
        authorName
        blogAuthor {
          id
          displayName
          email
          gravatarUrl
          slug
        }
        campaign
        campaignName
        metaDescription
        postBody
        postListContent
        postSummary
        tagIds
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
      blogPost(name: "Why don’t you have a monorepo?") {
        id
        name
        state
        slug
        url
        author
        authorAt
        authorEmail
        authorName
        blogAuthor {
          id
          displayName
          email
          gravatarUrl
          slug
        }
        campaign
        campaignName
        metaDescription
        postBody
        postListContent
        postSummary
        tagIds
      }
    }
    `;

    const result = await graphql(BlogPostSchema, query);

    expect(result.data).to.deep.equal({
      blogPost: blogPostFixtures.data.allBlogPosts[1],
    });
  });
});
