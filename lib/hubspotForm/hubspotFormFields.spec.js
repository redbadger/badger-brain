/* eslint-disable no-console, max-len */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import hubspotFormFixtures from '../../test/fixtures/hubspot-form.json';

const mockfetch = {
  fetchHubspotForm: () => hubspotFormFixtures,
};

const HubspotFormFields = injectr(
  '../../lib/hubspotForm/hubspotFormFields.js',
  {
    '../fetch': mockfetch,
  }
);

const HubspotFormSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: HubspotFormFields.HubspotFormSchemaFields,
  }),
});

describe('Hubspot Form Queries', () => {
  it('should be able to get a hubspot form by id', async () => {
    const query = `
    query {
      hubspotForm(id: "${hubspotFormFixtures.guid}") {
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
  `;

    const result = await graphql(HubspotFormSchema, query);
    expect(result.data.hubspotForm).to.deep.equal(hubspotFormFixtures);
  });
});
