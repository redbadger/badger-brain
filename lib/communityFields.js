import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { fetchCommunity, fetchEventById, fetchAllCommunities } from './fetch';
import { EventType } from './eventFields';

const communityType = new GraphQLObjectType({
  name: 'Community',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the community',
    },
    communitySummary: {
      type: GraphQLString,
      description: 'A summary of the community',
    },
    mailingListTitle: {
      type: GraphQLString,
      description: 'The title of the mailing list',
    },
    event: {
      type: EventType,
      description: 'The current event that is displayed on the community page',
      resolve(community) {
        if (community && community.displayedEventId) {
          return fetchEventById(community.displayedEventId);
        }
        return null;
      },
    },
  },
});

export const CommunitySchemaFields = {
  community: {
    type: communityType,
    description: 'Request all Red Badger social events, past and upcoming',
    args: {
      id: { type: GraphQLString },
    },
    resolve: fetchCommunity,
  },
  allCommunities: {
    type: new GraphQLList(communityType),
    description: 'Request all Red Badger social events, past and upcoming',
    resolve: fetchAllCommunities,
  },
};
