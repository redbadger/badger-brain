import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import _ from 'lodash';
import {
  fetchEvent,
  fetchAllEvents,
  getDocumentById,
  sanitizeTalk,
} from '../fetch';
import { TalkType } from '../talk/talkFields';

const EventRelatedLinkType = new GraphQLObjectType({
  name: 'EventRelatedLink',
  fields: {
    title: {
      type: GraphQLString,
      description: 'Label of the link',
    },
    url: {
      type: GraphQLString,
      description: 'Full URL of the link',
    },
  },
});

const EventDateTimeType = new GraphQLObjectType({
  name: 'EventDateTime',
  fields: {
    iso: {
      type: GraphQLString,
      description: 'Full date time in ISO format',
    },
    date: {
      type: GraphQLString,
      description: 'Numeric representation of the date of the event',
    },
    month: {
      type: GraphQLString,
      description: 'Numeric representation of the month of the event',
    },
    monthSym: {
      type: GraphQLString,
      description: 'Symbolic representation of the date of the event',
    },
    year: {
      type: GraphQLString,
      description: 'Numeric representation of the year of the event',
    },
  },
});

const EventBodyStructuredTextType = new GraphQLObjectType({
  name: 'EventBodyStructuredText',
  fields: {
    type: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
  },
});

export const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique id of event',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
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
      type: new GraphQLList(EventRelatedLinkType),
      description: 'List of related internal links',
    },
    externalLinks: {
      type: new GraphQLList(EventRelatedLinkType),
      description: 'List of related external links',
    },
    datetime: {
      type: EventDateTimeType,
    },
    body: {
      type: new GraphQLList(EventBodyStructuredTextType),
      description: 'Structured body with full description of the event',
    },
    featureImageFilename: {
      type: GraphQLString,
      description: 'Filename of an image uploaded to a 3rd party hosting service',
    },
    talks: {
      type: new GraphQLList(TalkType),
      description: 'List of talks given at the event',
      resolve(event) {
        if (event) {
          return event.talks.map((result) => {
            const id = _.get(result, 'data.value.document.id', '');
            return getDocumentById(id, 'talk', sanitizeTalk);
          });
        }
        return [];
      },
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
