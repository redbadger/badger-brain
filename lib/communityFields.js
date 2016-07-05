import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { fetchCommunity, fetchEventById } from './fetch';
import { EventType } from './eventFields';

const communityType = new GraphQLObjectType({
  name: 'Community',
  fields: {
    communitySummary: { type: GraphQLString },
    mailingListTitle: { type: GraphQLString },
    displayedEventId: { type: GraphQLString },
    event: {
      type: EventType,
      description: 'Request all Red Badger social events, past and upcoming',
      resolve(community) {
        return fetchEventById(community.displayedEventId);
      },
    },
  },
});

export const CommunitySchemaFields = {
  community: {
    type: communityType,
    description: 'Request all Red Badger social events, past and upcoming',
    resolve: fetchCommunity,
  },
};
