/* eslint-disable no-console, max-len */

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import eventsFixtures from '../test/fixtures/tags.json';

const mockfetch = {
  fetchDocsTaggedWith: () => eventsFixtures,
};

const TagFields = injectr('./../../lib/tagFields.js', {
  './fetch': mockfetch,
});

const EventsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: TagFields.TagSchemaFields,
  }),
});

describe('Queries', () => {
  it('should be able to get tagged documents', async () => {
    const query = `
      query {
        docsTaggedWith(tag: "123") {
          results
        }
      }
    `;

    const result = await graphql(EventsSchema, query);

    expect(result.data.docsTaggedWith.results[0].uid).to.equal('designing-in-cross-functional-teams');
    expect(result.data.docsTaggedWith.results[1].uid).to.equal('june-london-react-user-group');
  });
});
