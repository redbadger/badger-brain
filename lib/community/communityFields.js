import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { pathOr } from 'ramda';
import {
  fetchCommunity,
  fetchAllCommunities,
  fetchEvent,
} from '../fetch';

import { EventType } from '../event/eventFields';
import {
  DEFAULT_DISPLAY_LEVEL,
  CommunityEventType,
} from '../communityEvent/communityEventFields';

function fetchCommunityEventData(eventData) {
  const id = pathOr('', ['data', 'value', 'document', 'id'], eventData);
  const displayLevel = pathOr(DEFAULT_DISPLAY_LEVEL, ['displayLevel', 'value'], eventData);
  return fetchEvent({ id }).then(event => ({ ...event, displayLevel }));
}

const communityType = new GraphQLObjectType({
  name: 'Community',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the community',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the community',
    },
    summary: {
      type: GraphQLString,
      description: 'A summary of the community',
    },
    mailingListTitle: {
      type: GraphQLString,
      description: 'The title of the community mailing list',
    },
    featuredEvent: { // TODO: Test my resolver!
      type: EventType,
      description: 'The community\'s featured event',
      resolve(community) {
        if (community) {
          const id = pathOr('', ['document', 'id'], community.featuredEvent);
          return fetchEvent({ id });
        }
        return null;
      },
    },
    mailingListSummary: {
      type: GraphQLString,
      description: 'The summary of the community mailing list',
    },
    // TODO: Test me!
    events: {
      type: new GraphQLList(CommunityEventType),
      description: 'The community\'s events',
      resolve(community) {
        if (community) {
          return community.events.map(fetchCommunityEventData);
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
    resolve: (source, args) => fetchCommunity(args),
  },
  allCommunities: {
    type: new GraphQLList(communityType),
    description: 'Request all Red Badger communities',
    resolve: fetchAllCommunities,
  },
};
