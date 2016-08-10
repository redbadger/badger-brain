import { pathOr } from 'ramda';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInterfaceType,
} from 'graphql';
import {
  BodyStructuredTextType,
  DateTimeType,
  RelatedLinkType,
  LocationType,
  ScheduleItemType,
  SponsorItemType,
} from '../../sharedTypes';
import { fetchTalk } from '../../fetch';
import { TalkType } from '../../talk/talkFields';
import { BasicEventType } from '../../basicEvent';
import { mapDateTime, mapItemList } from '../../resolvers';

export const eventTypeFields = {
  id: {
    type: GraphQLString,
    description: 'Unique id of event',
  },
  slug: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'URL friendly representation of the event title',
  },
  eventType: {
    type: GraphQLString,
    description: 'The type of the event. For example "Conference" or "Meetup"',
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
    resolve: mapItemList('internalLinks'),
  },
  externalLinks: {
    type: new GraphQLList(RelatedLinkType),
    description: 'List of related external links',
    resolve: mapItemList('externalLinks'),
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
  ticketReleaseDate: {
    type: DateTimeType,
    description: 'The date when the event tickets are released.',
    resolve: mapDateTime('ticketReleaseDate'),
  },
  ticketsAvailable: {
    type: GraphQLBoolean,
    description: 'A boolean to show whether tickets are availiable',
  },
  waitingListOpen: {
    type: GraphQLBoolean,
    description: 'A boolean to show whether the waiting list is open',
  },
  schedule: {
    type: new GraphQLList(ScheduleItemType),
    description: 'An array of schedule items that each have a date and text description',
    resolve: mapItemList('schedule'),
  },
  sponsors: {
    type: new GraphQLList(SponsorItemType),
    description: 'An array of sponsors of the event',
    resolve: mapItemList('sponsors'),
  },
  body: {
    type: new GraphQLList(BodyStructuredTextType),
    description: 'Structured body with full description of the event',
  },
  featureImageFilename: {
    type: GraphQLString,
    description: 'Filename of an image uploaded to a 3rd party hosting service',
  },
  location: {
    type: LocationType,
    description: 'The address of the event in both postal and coordinate form',
  },
  talks: {
    type: new GraphQLList(TalkType),
    description: 'List of talks given at the event',
    resolve(event) {
      if (event && event.talks) {
        return event.talks.map((result) => {
          const id = pathOr('', ['data', 'value', 'document', 'id'], result);
          return fetchTalk({ id });
        });
      }
      return [];
    },
  },
};


export default new GraphQLInterfaceType({
  name: 'Event',
  fields: eventTypeFields,
  resolveType: () => BasicEventType,
});
