/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import communityFixtures from '../test/fixtures/conference.json';

const mockfetch = {
  fetchCommunity: () => communityFixtures.community,
  fetchEventById: () => communityFixtures.community.event,
};

const CommunityFields = injectr('./../../lib/communityFields.js', {
  './fetch': mockfetch,
});

const CommunitySchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: CommunityFields.CommunitySchemaFields,
  }),
});

describe('Community Queries', () => {
  it('should be able to get the community info as well as the current event', async () => {
    const query = `
    query {
      community {
        communitySummary
        mailingListTitle
        displayedEventId
        event {
          id
        }
      }
    }
    `;

    const result = await graphql(CommunitySchema, query);
    expect(result.data).to.deep.equal({
      community: {
        communitySummary: 'React is having a huge impact on the way we think about Web UI development. Our Meetups are an opportunity to learn why and share experiences. We are a sociable group and very welcoming to newcomers.\nSee you soon!',
        mailingListTitle: 'Gxet ticket reminders and event information about React London events straight to your inbox.',
        displayedEventId: 'V3pz8ykAACgAgAqr',
        event: {
          id: 'V3pz8ykAACgAgAqr',
        },
      },
    });
  });
});
