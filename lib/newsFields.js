import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { EventType } from './eventFields.js';
import { fetchOne, fetchAll } from './eventOrNewsFetch.js';

export const NewsSchemaFields = {
  news: {
    type: EventType,
    description: 'Request a single Red Badger news article by its ID',
    args: {
      id: { type: GraphQLString },
    },
    resolve: () => { return fetchOne('news'); },
  },
  allNews: {
    type: new GraphQLList(EventType),
    description: 'Request all Red Badger news',
    resolve: () => { return fetchAll('news'); },
  },
};
