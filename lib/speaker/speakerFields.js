import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';

import { BodyStructuredTextType } from '../sharedTypes';

import { fetchSpeaker, fetchAllSpeakers } from '../fetch';

export const SpeakerType = new GraphQLObjectType({
  name: 'Speaker',
  fields: {
    id: {
      type: GraphQLString,
      description: "The speaker's id",
    },
    name: {
      type: GraphQLString,
      description: "The speaker's name",
    },
    company: {
      type: GraphQLString,
      description: "The speaker's company",
    },
    twitterHandle: {
      type: GraphQLString,
      description: "A URL linking to the speaker's Twitter handle",
    },
    githubHandle: {
      type: GraphQLString,
      description: "A URL link to the speaker's GitHub profile",
    },
    imageURL: {
      type: GraphQLString,
      description: 'An URL link to the image of the speaker',
    },
    blogURL: {
      type: GraphQLString,
      description: "A URL link to the speaker's blog",
    },
    bio: {
      type: new GraphQLList(BodyStructuredTextType),
      description: 'Structured text in markdown with full description of the speaker',
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
    resolve: (source, args) => fetchSpeaker(args),
  },
  allSpeakers: {
    type: new GraphQLList(SpeakerType),
    description: 'Request all speakers',
    resolve: fetchAllSpeakers,
  },
};
