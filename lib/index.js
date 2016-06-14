/* eslint-disable no-console */

import 'babel-polyfill';
import 'http';
import fs from 'fs';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { EventSchema } from './eventSchema.js';
import colours from 'colors/safe';

const badger = fs.readFileSync(`${__dirname}/../assets/badger.txt`, 'utf-8');

express()
  .use('/graphql', graphqlHTTP({
    schema: EventSchema,
    pretty: true,
    graphiql: true,
  }))
  .listen(3001);

console.log(badger);
console.log(colours.inverse.bold(`
  Badger Brain GraphQL server is running at http://127.0.0.1:3001/

  Navigate to ${colours.green.underline('http://127.0.0.1:3001/graphql')} in your browser for
  a full GraphiQL experience`));
