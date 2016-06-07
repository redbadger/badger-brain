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

import data from '../events-data.json';

const badger = fs.readFileSync(__dirname + '/../assets/badger.txt', 'utf-8');

const EventRelatedLinkType = new GraphQLObjectType({
  name: 'EventRelatedLink',
  fields: {
    title: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    }
  }
});

const EventDateTimeType = new GraphQLObjectType({
  name: 'EventDateTime',
  fields: {
    locale: {
      type: GraphQLString
    },
    iso: {
      type: GraphQLString
    },
    date: {
      type: GraphQLString
    },
    month: {
      type: GraphQLString
    },
    monthSym: {
      type: GraphQLString
    },
    year: {
      type: GraphQLString
    }
  }
});

const EventType = new GraphQLObjectType ({
  name: 'Event',
  fields: {
    id: {
      type: GraphQLString
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      type: GraphQLString
    },
    strapline: {
      type: GraphQLString
    },
    internalLinks: {
      type: new GraphQLList(EventRelatedLinkType)
    },
    externalLinks: {
      type: new GraphQLList(EventRelatedLinkType)
    },
    datetime: {
      type: EventDateTimeType
    }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      event: {
        type: EventType,
        args: {
          id: { type: GraphQLString }
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
