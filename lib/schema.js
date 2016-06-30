import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { EventSchemaFields } from './eventSchema.js';
import { NewsSchemaFields } from './newsSchema.js';

export const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: Object.assign(EventSchemaFields, NewsSchemaFields),
  }),
});
