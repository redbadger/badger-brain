/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import eventsBannerFixtures from '../../test/fixtures/eventsBanner.json';

const mockfetch = {
  fetchEventsBanner: () => eventsBannerFixtures.data.eventsBanner,
};

const EventsBannerFields = injectr('../../lib/events-banner/events-banner-fields.js', {
  '../fetch': mockfetch,
});

const EventsBannerSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: EventsBannerFields.EventsBannerFields,
  }),
});

const eventsBannerFieldsForQuery = `
  url
  altText
  desktop
  tablet
  mobile
`;

describe('Events banner Queries', () => {
  it('should be able to get the event banner', async () => {
    const query = `
      query {
        eventsBanner {
          ${eventsBannerFieldsForQuery}
        }
      }
    `;

    const result = await graphql(EventsBannerSchema, query);

    expect(result.data).to.deep.equal(eventsBannerFixtures.data);
  });
});
