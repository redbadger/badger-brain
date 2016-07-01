import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { EventSchemaFields } from './eventFields.js';
import { NewsSchemaFields } from './newsFields.js';

export const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: Object.assign(EventSchemaFields, NewsSchemaFields),
  }),
});