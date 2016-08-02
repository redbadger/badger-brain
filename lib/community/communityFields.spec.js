/* eslint-disable no-console */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import communityFixtures from '../../test/fixtures/community.json';

const mockfetch = {
  fetchCommunity: () => communityFixtures.data.allCommunities[0],
  fetchAllCommunities: () => communityFixtures.data.allCommunities,
  fetchEvent: () => communityFixtures.data.allCommunities[0],
};

const CommunityFields = injectr('./../../lib/community/communityFields.js', {
  '../fetch': mockfetch,
});

const CommunitySchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: CommunityFields.CommunitySchemaFields,
  }),
});

describe('Community Queries', () => {
  it('should be able to get all the communities', async () => {
    const query = `
    query {
     	allCommunities {
     	  id
        title
        mailingListTitle
        mailingListSummary
     	}
    }
    `;

    const result = await graphql(CommunitySchema, query);
    expect(result.data).to.deep.equal(communityFixtures.data);
  });

  it('should be able to get a community by id', async () => {
    const query = `
    query {
     	community(id: "V34vMyMAAMke1asn") {
     	  id
        title
        mailingListTitle
        mailingListSummary
     	}
    }
    `;

    const result = await graphql(CommunitySchema, query);
    expect(result.data).to.deep.equal({
      community: communityFixtures.data.allCommunities[0],
    });
  });
});
