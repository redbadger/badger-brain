/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import eventsFixtures from '../../test/fixtures/events.json';

const mockFetch = {
  fetchEvent: () => eventsFixtures.events[0],
  fetchAllEvents: () => eventsFixtures.events,
};

const EventsFields = injectr('../../lib/event/eventFields.js', {
  '../fetch': mockFetch,
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
          schedule {
            datetime
            text
          }
          eventActionLink
          ticketsAvailiable
          sponsors {
            websiteURL
            imageURL
            name
          }
          ticketReleaseDate {
            date
          }
          featureImageFilename
          location {
            address
            coordinates {
              latitude
              longitude
            }
          }
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
          location: {
            address: '17 Mulberry Lane',
            coordinates: {
              latitude: '51.518550762323734',
              longitude: '-0.08610963821411133',
            },
          },
          ticketReleaseDate: {
            date: '24',
          },
          eventActionLink: 'foo.com',
          ticketsAvailiable: false,
          schedule: [],
          sponsors: [],
        },
        {
          tags: [],
          title: 'ReactEurope 2016',
          slug: 'react-europe-2016',
          strapline: 'Red Badger are super excited to be sponsoring ReactEurope for the second year running!',
          featureImageFilename: 'react-europe.jpg',
          location: {
            address: '12 Chocolate Street',
            coordinates: {
              latitude: '51.518550762323734',
              longitude: '-0.08610963821411133',
            },
          },
          ticketReleaseDate: {
            date: '24',
          },
          schedule: [{
            datetime: '2016-07-25T23:00:00+0000',
            text: 'Doors open for pizza and beers',
          }, {
            datetime: '2016-07-25T23:00:00+0000',
            text: 'Intro from Stu',
          }, {
            datetime: '2016-07-25T23:00:00+0000',
            text: 'Various speakers chat',
          }],
          eventActionLink: 'foo.com',
          ticketsAvailiable: false,
          sponsors: [{
            imageURL: 'http://react.london/img/SVG/Badger_Roundel.svg',
            websiteURL: 'http://red-badger.com',
            name: 'Red Badger',
          }],
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
          location {
            address
            coordinates {
              latitude
              longitude
            }
          }
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
        location: {
          address: '17 Mulberry Lane',
          coordinates: {
            latitude: '51.518550762323734',
            longitude: '-0.08610963821411133',
          },
        },
      },
    });
  });
});
