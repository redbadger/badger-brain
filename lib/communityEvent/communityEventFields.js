import { GraphQLObjectType } from 'graphql';
import { eventTypeFields } from '../event/eventFields';
import EventInterface from '../interfaces/event';

export const CommunityEventType = new GraphQLObjectType({
  name: 'CommunityEvent',
  interfaces: [
    EventInterface,
  ],
  fields: {
    ...eventTypeFields,
  },
});
