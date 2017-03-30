/* eslint-disable no-console, max-len */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';

import qnaFixtures from '../../test/fixtures/q-and-a.json';

const mockfetch = {
  fetchAllQnA: () => qnaFixtures.data.allQnA,
};

const QnAFields = injectr('../../lib/q-and-a/q-and-a-fields.js', {
  '../fetch': mockfetch,
});

const QnASchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: QnAFields.QnASchemaFields,
  }),
});

describe('Q and A Queries', () => {
  it(
    'should be able to get all available Q and A topics with categories',
    async () => {
      const query = `
    query {
      allQnA {
        category {
          name
          topics {
            question
            answer
          }
        }
      }
    }
    `;

      const result = await graphql(QnASchema, query);

      expect(result.data).to.deep.equal(qnaFixtures.data);
    },
  );
});
