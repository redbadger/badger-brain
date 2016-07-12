import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { pathOr } from 'ramda';
import {
  fetchCommunity,
  fetchAllCommunities,
  getDocumentById,
  sanitizeEventAndNews,
} from '../fetch';

import { EventType } from '../event/eventFields';

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
    events: {
      type: new GraphQLList(EventType),
      description: 'The community\'s events',
      resolve(community) {
        if (community) {
          return community.events.map((result) => {
            const id = pathOr('', ['data', 'value', 'document', 'id'], result);
            return getDocumentById(id, 'event', sanitizeEventAndNews);
          });
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
