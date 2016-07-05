import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import {
  BodyStructuredTextType,
  DateTimeType,
  RelatedLinkType,
} from './sharedTypes';

import { mapDateTime, mapLinkList } from './resolvers';
import { fetchEvent, fetchAllEvents } from './fetch';

export const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique id of event',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'URL friendly representation of the event title',
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'List of tags related the event',
    },
    title: {
      type: GraphQLString,
      description: 'Event title',
    },
    strapline: {
      type: GraphQLString,
      description: 'Brief description of the event',
    },
    internalLinks: {
      type: new GraphQLList(RelatedLinkType),
      description: 'List of related internal links',
      resolve: mapLinkList('internalLinks'),
    },
    externalLinks: {
      type: new GraphQLList(RelatedLinkType),
      description: 'List of related external links',
      resolve: mapLinkList('externalLinks'),
    },
    datetime: {
      type: DateTimeType,
      description: '[DEPRECATED] Date and time of the event',
      deprecationReason: 'Renamed to "startDateTime"',
      resolve: mapDateTime('datetime'),
    },
    startDateTime: {
      type: DateTimeType,
      description: 'Start date and time of the event',
      resolve: mapDateTime('startDateTime'),
    },
    endDateTime: {
      type: DateTimeType,
      resolve: mapDateTime('endDateTime'),
    },
    body: {
      type: new GraphQLList(BodyStructuredTextType),
      description: 'Structured body with full description of the event',
    },
    featureImageFilename: {
      type: GraphQLString,
      description: 'Filename of an image uploaded to a 3rd party hosting service',
    },
  },
});

export const EventSchemaFields = {
  event: {
    type: EventType,
    description: 'Request a single Red Badger social event by its ID',
    args: {
      id: { type: GraphQLString },
    },
    resolve: fetchEvent,
  },
  allEvents: {
    type: new GraphQLList(EventType),
    description: 'Request all Red Badger social events, past and upcoming',
    resolve: fetchAllEvents,
  },
};
