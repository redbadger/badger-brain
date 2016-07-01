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
import eventsFixtures from '../test/fixtures/events.json';

injectr.onload = (filename, content) =>
  transform(content, {
    filename,
  }).code;


const mockfetch = {
  fetchEvent: () => eventsFixtures.events[0],
  fetchAllEvents: () => eventsFixtures.events,
};

const EventsFields = injectr('./eventFields.js', {
  './fetch': mockfetch,
});

const EventsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: EventsFields.EventSchemaFields,
  }),
});

describe('Queries', () => {
  it('should be able to get all available events', async () => {
    const query = `
      query {
        allEvents {
          tags
          title
          slug
          strapline
          featureImageFilename
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
        },
        {
          tags: [],
          title: 'ReactEurope 2016',
          slug: 'react-europe-2016',
          strapline: 'Red Badger are super excited to be sponsoring ReactEurope for the second year running!',
          featureImageFilename: 'react-europe.jpg',
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
      },
    });
  });
});
