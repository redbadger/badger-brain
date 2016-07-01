/* eslint-disable no-console, max-len */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import injectr from 'injectr';
import { transform } from 'babel-core';
import newsFixtures from '../test/fixtures/news.json';

injectr.onload = (filename, content) =>
  transform(content, {
    filename,
  }).code;


const mockfetch = {
  fetchNewsArticle: () => newsFixtures.news[0],
  fetchAllNews: () => newsFixtures.news,
};

const NewsFields = injectr('./newsFields.js', {
  './fetch': mockfetch,
});

const NewsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: NewsFields.NewsSchemaFields,
  }),
});

describe('Queries', () => {
  it('should be able to get all available news', async () => {
    const query = `
      query {
        allNews {
          title
          slug
          strapline
          featureImageFilename
        }
      }
    `;

    const result = await graphql(NewsSchema, query);

    expect(result.data).to.deep.equal({
      allNews: [{
        title: 'Cain discusses motivating staff, beyond the ‘carrot and stick’ of cold hard cash.',
        slug: 'cain-discusses-motivating-staff-beyond-the-carrot-and-stick-of-cold-hard-cash.',
        strapline: 'Red Badger CEO Cain Ullah explains how he and the other Founders learned from their own experience to build incentives for Red Badger that go beyond the impersonal ‘reward’ of financial bonuses',
        featureImageFilename: 'soda-report2.jpg'
      }, {
        title: 'Red Badger Shortlisted for Employee Engagement Award!',
        slug: 'red-badger-shortlisted-for-employee-engagement-award',
        strapline: 'We are really proud to announce that we’ve been shortlisted for the 2016 Employee Engagement Awards in the category Employee Recognition & Reward.',
        featureImageFilename: 'uk-employee-award-finalists.jpg'
      }]
    });
  });

  it('should be able to get single news article based on ID', async () => {
    const query = `
      query {
        news(id: "123") {
          title
          slug
          strapline
          featureImageFilename
        }
      }
    `;

    const result = await graphql(NewsSchema, query);

    expect(result.data).to.deep.equal({
      news: {
        featureImageFilename: "soda-report2.jpg",
        slug: "cain-discusses-motivating-staff-beyond-the-carrot-and-stick-of-cold-hard-cash.",
        strapline: "Red Badger CEO Cain Ullah explains how he and the other Founders learned from their own experience to build incentives for Red Badger that go beyond the impersonal ‘reward’ of financial bonuses",
        title: "Cain discusses motivating staff, beyond the ‘carrot and stick’ of cold hard cash."
      },
    });
  });
});
