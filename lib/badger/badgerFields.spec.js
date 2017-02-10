/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import badgersFixtures from '../../test/fixtures/badgers.json';

const mockfetch = {
  fetchAllBadgers: () => badgersFixtures.data.allBadgers,
  fetchBadger: () => badgersFixtures.data.allBadgers[0],
};

const BadgerFields = injectr('../../lib/badger/badgerFields.js', {
  '../fetch': mockfetch,
});

const BadgerSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: BadgerFields.BadgerSchemaFields,
  }),
});

describe('Badger Queries', () => {
  it('should be able to get all available badgers', async () => {
    const query = `
    query {
      allBadgers {
        id
        slug
        firstName
        lastName
        order
        jobTitle
        primaryImageUrl
        secondaryImageUrl
        startDate
        about
        skills
        influence
        achievements
        linkedin
        github
        twitter
        squarespaceId
        categories {
          name
          slug
          order
        }
      }
    }
    `;

    const result = await graphql(BadgerSchema, query);

    expect(result.data).to.deep.equal(badgersFixtures.data);
  });

  it('should be able to get single badger based on ID', async () => {
    const query = `
    query {
      badger(id: "WFz97iYAAJAYbwDh") {
        id
        slug
        firstName
        lastName
        order
        jobTitle
        primaryImageUrl
        secondaryImageUrl
        startDate
        about
        skills
        influence
        achievements
        linkedin
        github
        twitter
        squarespaceId
        categories {
          name
          slug
          order
        }
      }
    }
    `;

    const result = await graphql(BadgerSchema, query);

    expect(result.data).to.deep.equal({ badger: badgersFixtures.data.allBadgers[0] });
  });
});
