/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import eventsFixtures from '../../test/fixtures/events.json';

const mockfetch = {
  fetchEvent: () => eventsFixtures.events[0],
  fetchAllEvents: () => eventsFixtures.events,
};

const EventsFields = injectr('../../lib/event/eventFields.js', {
  '../fetch': mockfetch,
});

const EventsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: EventsFields.EventSchemaFields,
  }),
});

describe('Event Queries', () => {
  it('should be able to get all available events', async () => {
    const query = `
      query {
        allEvents {
          tags
          title
          slug
          strapline
          featureImageFilename
          address
        }
      }
    `;

    const result = await graphql(EventsSchema, query);

    expect(result.data).to.deep.equal({
      allEvents: [
        {
          tags: ['London Node', 'BBC Now'],
          title: 'David Wynne and Joe Stanton talking at London Node User Group',
          slug: 'london-node-user-group',
          strapline: 'BBC Now ...that’s what I call Node!',
          featureImageFilename: 'profile_DW_thumb.jpg',
          address: '17 Mulberry Lane',
        },
        {
          tags: [],
          title: 'ReactEurope 2016',
          slug: 'react-europe-2016',
          strapline: 'Red Badger are super excited to be sponsoring ReactEurope for the second year running!',
          featureImageFilename: 'react-europe.jpg',
          address: '12 Chocolate Street',
        },
      ],
    });
  });

  it('should be able to get single event based on ID', async () => {
    const query = `
      query {
        event(id: "123") {
          title
          slug
          strapline
          featureImageFilename
          address
        }
      }
    `;

    const result = await graphql(EventsSchema, query);
    expect(result.data).to.deep.equal({
      event: {
        title: 'David Wynne and Joe Stanton talking at London Node User Group',
        slug: 'london-node-user-group',
        strapline: 'BBC Now ...that’s what I call Node!',
        featureImageFilename: 'profile_DW_thumb.jpg',
        address: '17 Mulberry Lane',
      },
    });
  });
});
