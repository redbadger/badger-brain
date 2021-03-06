/* eslint-disable no-console, max-len */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import goldCoinPageFixtures from '../../test/fixtures/goldCoinPages.json';

const mockfetch = {
  fetchAllGoldCoinPages: () => goldCoinPageFixtures.data.allGoldCoinPages,
};

const GoldCoinPageFields = injectr(
  '../../lib/goldCoinPage/goldCoinPageFields.js',
  {
    '../fetch': mockfetch,
  }
);

const GoldCoinPageSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: GoldCoinPageFields.GoldCoinPageSchemaFields,
  }),
});

describe('Gold Coin Page Queries', () => {
  it('should be able to get all available Gold Coin Pages', async () => {
    const query = `
    query {
      allGoldCoinPages {
        unlisted
        slug
        title
        subTitle
        headerImage {
          main
          large
          medium
          small
        }
        headerAlt
        duration
        price
        type
        location
        whatIsIt
        whoIsItFor
        whatWillYouLearn
        whoWillRun
        consultants
        hubspotForm {
          portalId
          guid
          name
          cssClass
          submitText
          inlineMessage
          formFields {
            richText
            name
            label
            fieldType
            description
            defaultValue
            placeholder
            required
            enabled
            hidden
            labelHidden
          }
          formConsent {
      	    consentMessage
      	    checkboxes {
        	    label
        	    required
      	    }
    	    }
        }
      }
    }
    `;

    const result = await graphql(GoldCoinPageSchema, query);
    expect(result.data).to.deep.equal(goldCoinPageFixtures.data);
  });
});
