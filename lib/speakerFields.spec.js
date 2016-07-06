/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import speakerFixtures from '../test/fixtures/speakers.json';

const mockfetch = {
  fetchAllSpeakers: () => speakerFixtures.data.allSpeakers,
  fetchSpeaker: () => speakerFixtures.data.allSpeakers[0],
};

const SpeakerFields = injectr('./../../lib/speakerFields.js', {
  './fetch': mockfetch,
});

const SpeakerSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: SpeakerFields.SpeakerSchemaFields,
  }),
});

describe('Speaker Queries', () => {
  it('should be able to get all available news', async () => {
    const query = `
    query {
      allSpeakers {
        id
        name
        company
        talkTitle
        talkSummary
        twitterHandle
        githubHandle
        blogURL
        imageURL
      }
    }
    `;

    const result = await graphql(SpeakerSchema, query);

    expect(result.data).to.deep.equal({
      allSpeakers: [
        {
          id: 'V30LsSMAANwL0Rvp',
          name: 'Kadi Kraman',
          company: 'Red Badger',
          talkTitle: 'Draft.js in the real world',
          talkSummary: 'Earlier this year, Facebook came out with their take on building a highly customisable rich text editor ­Draft.js. Built especially for React and powered by an immutable data model, it takes on the daunting task of solving all our rich text editing problems. She will provide a brief explanation on how Draft.js works and talk about her experience using it on a project along with Redux Form.',
          twitterHandle: '@kadi',
          githubHandle: 'kadi',
          blogURL: 'http://blog',
          imageURL: 'http://image',
        },
        {
          id: 'V30LsSMAANwL0Rvp2',
          name: 'Andrew Bestbier',
          company: 'Red Badger',
          talkTitle: 'An Introduction to React',
          talkSummary: 'Earlier this year, Facebook introduced React to the world',
          twitterHandle: '@andrew',
          githubHandle: 'andrew',
          blogURL: 'http://blog',
          imageURL: 'http://image',
        },
      ],
    });
  });

  it('should be able to get single news article based on ID', async () => {
    const query = `
      query {
        speaker(id: "V30LsSMAANwL0Rvp"){
          id
          name
          company
          talkTitle
          talkSummary
          twitterHandle
          githubHandle
          blogURL
          imageURL
        }
      }
    `;

    const result = await graphql(SpeakerSchema, query);

    expect(result.data).to.deep.equal({
      speaker: {
        id: 'V30LsSMAANwL0Rvp',
        name: 'Kadi Kraman',
        company: 'Red Badger',
        talkTitle: 'Draft.js in the real world',
        talkSummary: 'Earlier this year, Facebook came out with their take on building a highly customisable rich text editor ­Draft.js. Built especially for React and powered by an immutable data model, it takes on the daunting task of solving all our rich text editing problems. She will provide a brief explanation on how Draft.js works and talk about her experience using it on a project along with Redux Form.',
        twitterHandle: '@kadi',
        githubHandle: 'kadi',
        blogURL: 'http://blog',
        imageURL: 'http://image',
      },
    });
  });
});
