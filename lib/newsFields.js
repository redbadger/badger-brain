import {
  GraphQLString,
  GraphQLList,
} from 'graphql';

import { EventType } from './eventFields.js';
import { fetchNewsArticle, fetchAllNews } from './fetch';

export const NewsSchemaFields = {
  news: {
    type: EventType,
    description: 'Request a single Red Badger news article by its ID',
    args: {
      id: {
        type: GraphQLString,
        description: 'ID of the news article to fetch',
      },
    },
    resolve: fetchNewsArticle,
  },
  allNews: {
    type: new GraphQLList(EventType),
    description: 'Request all Red Badger news',
    args: {
      tag: {
        type: GraphQLString,
        description: 'Get news articles with this tag',
      },
    },
    resolve: fetchAllNews,
  },
};
