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
  fetchNews: () => newsFixtures.allNews[0],
};

const NewsFields = injectr('../../lib/news/newsFields.js', {
  '../fetch': mockFetch,
});

const NewsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: NewsFields.NewsSchemaFields,
  }),
});

describe('News Queries', () => {
  it('should be able to get list of news articles based on tag', async () => {
    const query = `
      query {
        allNews(tag: "awards") {
          title
        }
      }
    `;

    const result = await graphql(NewsSchema, query);

    expect(result.data).to.deep.equal({
      allNews: [
        {
          title: 'Cain discusses motivating staff, beyond the ‘carrot and stick’ of cold hard cash.',
        },
        {
          title: 'Red Badger Shortlisted for Employee Engagement Award!',
        },
      ],
    });
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
    expect(result).to.deep.equal(newsResolveFixtures);
  });
});
