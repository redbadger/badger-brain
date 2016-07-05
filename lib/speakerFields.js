import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const SpeakerType = new GraphQLObjectType({
  name: 'Speaker',
  fields: {
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
