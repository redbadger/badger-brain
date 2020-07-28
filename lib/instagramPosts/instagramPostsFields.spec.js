/* eslint-disable no-console, max-len */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import instagramPostsFixtures from '../../test/fixtures/instagramPosts.json';

const mockfetch = {
  fetchAllInstagramPosts: () => instagramPostsFixtures.data.allGoldCoinPages,
};

const InstagramPostsFields = injectr(
  '../../lib/instagramPosts/instagramPostsFields.js',
  {
    '../fetch': mockfetch,
  }
);

const InstagramPostsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: InstagramPostsFields.InstagramPostSchemaFields,
  }),
});

describe('InstagramPosts Queries', () => {
  it('should be able to get all available InstagramPosts', async () => {
    const query = `
    query {
      allInstagramPosts {
        text
        link
        image {
          url
          height
          width
        }
        comments
        likes
        created
      }
    }
    `;

    const result = await graphql(InstagramPostsSchema, query);
    expect(result.data).to.deep.equal(instagramPostsFixtures.data);
  });
});
