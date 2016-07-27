import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import {
  BodyStructuredTextType,
  DateTimeType,
  RelatedLinkType,
} from '../sharedTypes';
import { fetchNewsArticle, fetchAllNews } from '../fetch';

import { mapDateTime, mapItemList } from '../resolvers';

export const NewsItemType = new GraphQLObjectType({
  name: 'NewsItem',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique id of news item',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'URL friendly representation of the news item title',
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'List of tags related the news item',
    },
    title: {
      type: GraphQLString,
      description: 'News item title',
    },
    strapline: {
      type: GraphQLString,
      description: 'Brief description of the news item',
    },
    internalLinks: {
      type: new GraphQLList(RelatedLinkType),
      description: 'List of related internal links',
      resolve: mapItemList('internalLinks'),
    },
    externalLinks: {
      type: new GraphQLList(RelatedLinkType),
      description: 'List of related external links',
      resolve: mapItemList('externalLinks'),
    },
    datetime: {
      type: DateTimeType,
      description: 'Date and time of the news item',
      resolve: mapDateTime('datetime'),
    },
    body: {
      type: new GraphQLList(BodyStructuredTextType),
      description: 'Structured body with full description of the news item',
    },
    featureImageFilename: {
      type: GraphQLString,
      description: 'Filename of an image uploaded to a 3rd party hosting service',
    },
  },
});

export const NewsSchemaFields = {
  news: {
    type: NewsItemType,
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
    type: new GraphQLList(NewsItemType),
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
