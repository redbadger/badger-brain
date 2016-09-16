import {
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql';
import EventInterface, { eventTypeFields } from '../interfaces/event';

export const DEFAULT_DISPLAY_LEVEL = 'Regular';

const displayLevelValues = {
  Featured: { value: 'Featured' },
  Highlighted: { value: 'Highlighted' },
  Regular: { value: 'Regular' },
  Current: { value: 'Current' },
  Upcoming: { value: 'Upcoming' },
  Past: { value: 'Past' },
};

const DisplayLevelType = new GraphQLEnumType({
  name: 'displayLevel',
  values: displayLevelValues,
});

export const CommunityEventType = new GraphQLObjectType({
  name: 'CommunityEvent',
  interfaces: [
    EventInterface,
  ],
  fields: {
    ...eventTypeFields,
    displayLevel: {
      type: DisplayLevelType,
      description: 'The extent to which the event is highlighted within the' +
        'parent community.',
      resolve({ displayLevel }) {
        return displayLevel || DEFAULT_DISPLAY_LEVEL;
      },
    },
  },
});
