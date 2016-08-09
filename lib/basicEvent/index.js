import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import {
  fetchEvent,
  fetchAllEvents,
} from '../fetch';
import EventInterface, { eventTypeFields } from '../interfaces/event';

export const BasicEventType = new GraphQLObjectType({
  name: 'BasicEvent',
  interfaces: [
    EventInterface,
  ],
  fields: eventTypeFields,
});

export const BasicEventSchemaFields = {
  event: {
    type: BasicEventType,
    description: 'Request a single Red Badger social event by its ID',
    args: {
      id: {
        type: GraphQLString,
        description: 'ID of a single event',
      },
    },
    resolve: (source, args) => fetchEvent(args),
  },
  allEvents: {
    type: new GraphQLList(BasicEventType),
    description: 'Request all Red Badger social events, past and upcoming',
    args: {
      tag: {
        type: GraphQLString,
        description: 'Get all events with this tag',
      },
    },
    resolve: fetchAllEvents,
  },
};
