import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import {
  fetchEvent,
  fetchAllEvents,
} from '../fetch';

import { eventTypeFields } from '../event/eventFields';

export const CommunityEventType = new GraphQLObjectType({
  name: 'CommunityEvent',
  fields: {
    ...eventTypeFields,
  },
});

export const EventSchemaFields = {
  event: {
    type: CommunityEventType,
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
    type: new GraphQLList(CommunityEventType),
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
