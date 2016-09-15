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

const BasicEventsFields = injectr('../../lib/basicEvent/index.js', {
  '../fetch': mockFetch,
});

const EventsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: BasicEventsFields.BasicEventSchemaFields,
  }),
});

describe('Event Queries', () => {
  it('should be able to get events based on provided tag', async () => {
    const query = `
      query {
        allEvents(tag: "meetup") {
          title
        }
      }
    `;

    const result = await graphql(EventsSchema, query);

    expect(result.data).to.deep.equal({
      allEvents: [
        {
          title: 'David Wynne and Joe Stanton talking at London Node User Group',
        },
        {
          title: 'ReactEurope 2016',
        },
      ],
    });
  });

  it('should be able to get all available events', async () => {
    const query = `
      query {
        allEvents {
          tags
          title
          slug
          strapline
          internalLinks {
            title
            url
            type
          }
          externalLinks {
            title
            url
            type
          }
          schedule {
            datetime
            text
          }
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
          tags: ['London Node', 'BBC Now', 'meetup'],
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
          externalLinks: [
            {
              title: 'London Node.js User Group',
              type: 'STREAM',
              url: 'http://lnug.org/',
            },
            {
              title: 'Attend or track the event on Lanyrd',
              url: 'http://lanyrd.com/2013/lnug-july/',
              type: 'OTHER',
            },
          ],
          internalLinks: [
            {
              title: 'Who is David?',
              url: '/about-us/people/david-wynne',
              type: 'OTHER',
            },
          ],
          ticketReleaseDate: {
            date: '24',
          },
          schedule: [],
          sponsors: [],
        },
        {
          tags: ['conf', 'meetup'],
          title: 'ReactEurope 2016',
          slug: 'react-europe-2016',
          strapline: 'Red Badger are super excited to be sponsoring ReactEurope ' +
            'for the second year running!',
          featureImageFilename: 'react-europe.jpg',
          location: {
            address: '12 Chocolate Street',
            coordinates: {
              latitude: '51.518550762323734',
              longitude: '-0.08610963821411133',
            },
          },
          externalLinks: [
            {
              title: 'For more information please visit the conference page',
              url: 'https://www.react-europe.org/#about',
              type: 'TICKET',
            },
          ],
          internalLinks: [],
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
