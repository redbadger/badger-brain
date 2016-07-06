import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLScalarType,
  GraphQLError,
  Kind,
} from 'graphql';

import { fetchDocsTaggedWith } from './fetch';

export const DocsTaggedWithType = new GraphQLObjectType({
  name: 'DocsTaggedWith',
  fields: {
    page: {
      type: GraphQLInt,
      description: 'The current page number, the first one being 1',
    },
    results_per_page: {
      type: GraphQLInt,
      description: 'Max number of results per page',
    },
    results_size: {
      type: GraphQLInt,
      description: 'The size of the current page',
    },
    total_results_size: {
      type: GraphQLInt,
      description: 'The total size of results across all pages',
    },
    total_pages: {
      type: GraphQLInt,
      description: 'The number of pages',
    },
    results: {
      type: new GraphQLScalarType({
        name: 'ObjectType',
        serialize: value => value,
        parseValue: value => value,
        parseLiteral: ast => {
          if (ast.kind !== Kind.OBJECT) {
            throw new GraphQLError(`Query error: Can only parse object, but got
              a: ${ast.kind}`, [ast]);
          }
          return ast.value;
        },
      }),
      description: 'An array of document objects as returned from Prismic',
    },
    version: {
      type: GraphQLString,
    },
  },
});

export const TagSchemaFields = {
  docsTaggedWith: {
    type: DocsTaggedWithType,
    description: 'Request all documents tagged with the given tag',
    args: {
      tag: { type: GraphQLString },
    },
    resolve: fetchDocsTaggedWith,
  },
};
