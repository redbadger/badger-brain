import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const SpeakerType = new GraphQLObjectType({
  name: 'Speaker',
  fields: {
    name: {
      type: GraphQLString,
      description: 'Name of speaker',
    },
    company: {
      type: GraphQLString,
      description: 'Company of speaker',
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
      description: 'The twitter handle of the speaker',
    },
    githubHandle: {
      type: GraphQLString,
      description: 'The link to the github profile of the speaker',
    },
    blogURL: {
      type: GraphQLString,
      description: 'The blog link of the speaker',
    },
    imageURL: {
      type: GraphQLString,
      description: 'An URL to the image of the speaker',
    },
  },
});
