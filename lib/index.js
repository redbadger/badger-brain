/* eslint-disable no-console */

import 'babel-polyfill';
import 'http';
import fs from 'fs';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { Schema } from './schema.js';
import colours from 'colors/safe';

const port = 3001;
const server = `http://127.0.0.1:${port}`;
const badger = fs.readFileSync(`${__dirname}/../assets/badger.txt`, 'utf-8');

express()
  .use('/graphql', graphqlHTTP((request) => ({
    schema: Schema,
    context: request,
    pretty: true,
    graphiql: true,
  })))
  .listen(port);

console.log(badger);
console.log(colours.inverse.bold(`
  Badger Brain GraphQL server is running at ${server}

  Navigate to ${colours.green.underline(`${server}/graphql`)} in your browser for
  a full GraphiQL experience`));
