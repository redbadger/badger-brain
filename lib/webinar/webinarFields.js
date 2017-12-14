import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import {
  BodyStructuredTextType,
  DateTimeType,
} from '../sharedTypes';
import { pathOr } from 'ramda';
import { BadgerType } from '../badger/badgerFields';
import {
  fetchWebinar,
  fetchAllWebinars,
  fetchBadger,
} from '../fetch';
import { mapDateTime } from '../resolvers';

export const WebinarType = new GraphQLObjectType({
  name: 'Webinar',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the webinar',
    },
    slug: {
      type: GraphQLString,
      description: 'The slug of the webinar',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the webinar',
    },
    startDateTime: {
      type: DateTimeType,
      description: 'Start date and time of the webinar',
      resolve: mapDateTime('startDateTime'),
    },
    endDateTime: {
      type: DateTimeType,
      description: 'End date and time of the webinar',
      resolve: mapDateTime('endDateTime'),
    },
    featureImageFilename: {
      type: GraphQLString,
      description: 'Filename of an image uploaded',
    },
    body: {
      type: new GraphQLList(BodyStructuredTextType),
      description: 'Structured body with full description of the webinar',
    },
    speakers: {
      type: new GraphQLList(BadgerType),
      description: 'List of speakers giving the webinar',
      resolve(webinar) {
        if (webinar.speakers) {
          return webinar.speakers.map((result) => {
            const id = pathOr('', ['data', 'value', 'document', 'id'], result);
            return fetchBadger({ id });
          });
        }
        return [];
      },
    },
    webinarKey: {
      type: GraphQLString,
      description: 'The webinar-key of the webinar',
    },
  },
});

export const WebinarSchemaFields = {
  webinar: {
    type: WebinarType,
    description: 'Request a webinar by id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: (source, args) => fetchWebinar(args),
  },
  allWebinars: {
    type: new GraphQLList(WebinarType),
    description: 'Request all webinars',
    resolve: fetchAllWebinars,
  },
};
