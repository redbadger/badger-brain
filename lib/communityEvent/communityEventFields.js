import { GraphQLObjectType } from 'graphql';
import { eventTypeFields } from '../event/eventFields';

export const CommunityEventType = new GraphQLObjectType({
  name: 'CommunityEvent',
  fields: {
    ...eventTypeFields,
  },
});
