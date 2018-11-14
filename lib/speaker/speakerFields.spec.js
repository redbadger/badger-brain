/* eslint-disable no-console, max-len */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import speakerFixtures from '../../test/fixtures/speakers.json';

const mockfetch = {
  fetchAllSpeakers: () => speakerFixtures.data.allSpeakers,
  fetchSpeaker: () => speakerFixtures.data.allSpeakers[0],
};

const SpeakerFields = injectr('../../lib/speaker/speakerFields.js', {
  '../fetch': mockfetch,
});

const SpeakerSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: SpeakerFields.SpeakerSchemaFields,
  }),
});

describe('Speaker Queries', () => {
  it('should be able to get all available speakers', async () => {
    const query = `
    query {
     	allSpeakers {
        imageURL
     	  id
        name
        company
        githubHandle
        twitterHandle
        bio {
          type
          text
        }
     	}
    }
    `;

    const result = await graphql(SpeakerSchema, query);

    expect(result.data).to.deep.equal(speakerFixtures.data);
  });

  it('should be able to get single news article based on ID', async () => {
    const query = `
    query {
      speaker(id: "V35-XyMAAHMn1ugb") {
        id
        imageURL
        name
        company
        githubHandle
        twitterHandle
        bio {
          type
          text
        }
      }
    }
    `;

    const result = await graphql(SpeakerSchema, query);

    expect(result.data).to.deep.equal({ speaker: speakerFixtures.data.allSpeakers[0] });
  });
});
