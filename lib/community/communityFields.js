import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { pathOr } from 'ramda';
import {
  fetchCommunity,
  fetchAllCommunities,
  fetchEvents,
  fetchEvent,
} from '../fetch';

import { EventType } from '../event/eventFields';

function eventsList(communityProperty) {
  return {
    type: new GraphQLList(EventType),
    description: 'The community\'s events',
    resolve(community) {
      if (community) {
        return community[communityProperty].map(result => {
          const id = pathOr('', ['data', 'value', 'document', 'id'], result);
          return fetchEvents(undefined, { id });
        });
      }
      return [];
    },
  };
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
          return fetchEvent(undefined, { id });
        }
        return null;
      },
    },
    mailingListSummary: {
      type: GraphQLString,
      description: 'The summary of the community mailing list',
    },
    events: eventsList('events'), // TODO: Test my resolver!
    featuredEvents: eventsList('featuredEvents'), // TODO: Test my resolver!
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
