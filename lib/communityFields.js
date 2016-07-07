import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { fetchCommunity, fetchEventsByCommunityId, fetchAllCommunities } from './fetch';
import { EventType } from './eventFields';

const communityType = new GraphQLObjectType({
  name: 'Community',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the community',
    },
    communityTitle: {
      type: GraphQLString,
      description: 'The title of the community',
    },
    communitySummary: {
      type: GraphQLString,
      description: 'A summary of the community',
    },
    mailingListTitle: {
      type: GraphQLString,
      description: 'The title of the community mailing list',
    },
    events: {
      type: new GraphQLList(EventType),
      description: 'The community\'s events',
      resolve(community) {
        if (community) {
          return fetchEventsByCommunityId(community.id);
        }
        return [];
      },
    },
  },
});

export const CommunitySchemaFields = {
  community: {
    type: communityType,
    description: 'Request a community by id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: fetchCommunity,
  },
  allCommunities: {
    type: new GraphQLList(communityType),
    description: 'Request all Red Badger communities',
    resolve: fetchAllCommunities,
  },
};
