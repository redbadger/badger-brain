import http from 'http';
import fs from 'fs';
import express from 'express';
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';
import graphqlHTTP from 'express-graphql';
import { EventSchema } from './eventSchema.js';
const badger = fs.readFileSync(__dirname + '/../assets/badger.txt', 'utf-8');

express()
  .use('/graphql', graphqlHTTP({
    schema: EventSchema,
    pretty: true,
    graphiql: true
  }))
  .listen(3001);

console.log(badger);
console.log('Badger Brain GraphQL server running at http://127.0.0.1:3001/');
