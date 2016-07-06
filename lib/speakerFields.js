import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { fetchSpeaker, fetchAllSpeakers } from './fetch';

export const SpeakerType = new GraphQLObjectType({
  name: 'Speaker',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The speaker\'s id',
    },
    name: {
      type: GraphQLString,
      description: 'The speaker\'s name',
    },
    company: {
      type: GraphQLString,
      description: 'The speaker\'s company',
    },
    talkTitle: {
      type: GraphQLString,
      description: 'The title of the talk',
    },
    talkSummary: {
      type: GraphQLString,
      description: 'The summary of the talk',
    },
    twitterHandle: {
      type: GraphQLString,
      description: 'A URL linking to the speaker\'s Twitter handle',
    },
    githubHandle: {
      type: GraphQLString,
      description: 'A URL link to the speaker\'s GitHub profile',
    },
    blogURL: {
      type: GraphQLString,
      description: 'A URL link to the speaker\'s blog',
    },
    imageURL: {
      type: GraphQLString,
      description: 'An URL link to the image of the speaker',
    },
  },
});

export const SpeakerSchemaFields = {
  speaker: {
    type: SpeakerType,
    description: 'Request a speaker by their id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: fetchSpeaker,
  },
  allSpeakers: {
    type: new GraphQLList(SpeakerType),
    description: 'Request all speakers',
    resolve: fetchAllSpeakers,
  },
};
