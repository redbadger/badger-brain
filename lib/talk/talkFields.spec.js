/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import talksFixtures from '../../test/fixtures/talks.json';

const mockfetch = {
  fetchAllTalks: () => talksFixtures.data.allTalks,
  fetchTalk: () => talksFixtures.data.allTalks[0],
};

const TalkFields = injectr('../../lib/talk/talkFields.js', {
  '../fetch': mockfetch,
});

const TalkSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: TalkFields.TalkSchemaFields,
  }),
});

describe('Talk Queries', () => {
  it('should be able to get all available speakers', async () => {
    const query = `
    query {
     	allTalks {
     	  id
        title
        summary
     	}
    }
    `;

    const result = await graphql(TalkSchema, query);

    expect(result.data).to.deep.equal(talksFixtures.data);
  });

  it('should be able to get single news article based on ID', async () => {
    const query = `
    query {
     	talk(id: "V35vwyMAAFkk1q2R") {
     	  id
        title
        summary
     	}
    }
    `;

    const result = await graphql(TalkSchema, query);

    expect(result.data).to.deep.equal({ talk: talksFixtures.data.allTalks[0] });
  });
});
