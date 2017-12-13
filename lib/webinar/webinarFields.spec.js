/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import webinarFixtures from '../../test/fixtures/webinars.json';
import webinarResolveFixtures from '../../test/fixtures/webinars-resolve.json';

const mockfetch = {
  fetchAllWebinars: () => webinarFixtures.data.allWebinars,
  fetchWebinar: () => webinarFixtures.data.allWebinars[0],
  fetchBadger: () => webinarFixtures.data.allWebinars[0].speakers[0],
};

const WebinarFields = injectr('../../lib/webinar/webinarFields.js', {
  '../fetch': mockfetch,
});

const WebinarSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: WebinarFields.WebinarSchemaFields,
  }),
});

const webinarFieldsForQuery = `
  id
  slug
  title
  startDateTime {
    iso
    date
    month
    monthSym
    year
  }
  endDateTime {
    iso
    date
    month
    monthSym
    year
  }
  featureImageFilename
  body {
    type
    text
  }
  webinarKey
  speakers {
    id
    firstName
    lastName
    jobTitle
    primaryImageUrl
  }
`;

describe('Webinar Queries', () => {
  it('should be able to get all webinars', async () => {
    const query = `
      query {
        allWebinars {
          ${webinarFieldsForQuery}
        }
      }
    `;

    const result = await graphql(WebinarSchema, query);

    expect(result.data).to.deep.equal(webinarResolveFixtures.data);
  });

  it('should be able to get single webinar based on ID', async () => {
    const query = `
      query {
        webinar(id: "V35vwyMAAFkk1q2R") {
          ${webinarFieldsForQuery}
        }
      }
    `;

    const result = await graphql(WebinarSchema, query);

    expect(result.data).to.deep.equal({ webinar: webinarResolveFixtures.data.allWebinars[0] });
  });
});
