/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import newsFixtures from '../../test/fixtures/news.json';
import newsResolveFixtures from '../../test/fixtures/news-resolve.json';

const mockFetch = {
  fetchAllNews: () => newsFixtures.allNews,
  fetchNewsArticle: () => {
    console.log('hello there :)');
    return newsFixtures.allNews[0];
  },
};

console.log(mockFetch.fetchNewsArticle());
const NewsFields = injectr('../../lib/news/newsFields.js', {
  '../fetch': mockFetch,
});

const NewsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: NewsFields.NewsSchemaFields,
  }),
});

describe.only('News Queries', () => {
  it('should be able to get single news article based on ID', async () => {
    const query = `
      query {
        news(id: "123") {
          id
          slug
          title
          datetime {
            iso
            date
            month
            monthSym
            year
          }
          strapline
          internalLinks {
            title
            url
          }
          externalLinks {
            title
            url
          }
          body {
            type
            text
          }
          featureImageFilename
        }
      }
    `;

    const result = await graphql(NewsSchema, query);
    expect(result).to.deep.equal(newsResolveFixtures);
  });
});
