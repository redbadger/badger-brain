/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import newsFixtures from '../../test/fixtures/news.json';

const mockfetch = {
  fetchAllNews: () => newsFixtures.allNews,
  fetchNewsArticle: () => newsFixtures.allNews[0],
};

const NewsFields = injectr('../../lib/news/newsFields.js', {
  '../fetch': mockfetch,
});

const NewsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: NewsFields.NewsSchemaFields,
  }),
});

describe('News Queries', () => {
  it('should be able to get all available speakers', async () => {
    const query = `
      query {
        allNews {
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
    expect(result.data).to.deep.equal(newsFixtures);
  });

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

    expect(result.data).to.deep.equal({ news: newsFixtures.allNews[0] });
  });
});
