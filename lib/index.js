import http from 'http';
import fs from 'fs';
import express from 'express';
import * as graphql from 'graphql';
import graphqlHTTP from 'express-graphql';

import data from '../events-data.json';

const badger = fs.readFileSync(__dirname + '/../assets/badger.txt', 'utf-8');

const eventType = new graphql.GraphQLObjectType ({
  name: 'Event',
  fields: {
    id: {
      type: graphql.GraphQLString
    },
    title: {
      type: graphql.GraphQLString
    }
  }
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      event: {
        type: eventType,
        args: {
          id: { type: graphql.GraphQLString }
        },
        resolve: function (_, args) {
          return data["docs"][args.id];
        }
      }
    }
  })
});

express()
  .use('/graphql', graphqlHTTP({
    schema: schema,
    pretty: true,
    graphiql: true
  }))
  .listen(3001);

console.log(badger);
console.log('Badger Brain GraphQL server running at http://127.0.0.1:3001/');
