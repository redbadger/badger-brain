import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { NewsFetch, AllNewsFetch } from './newsFetch.js';

const NewsRelatedLinkType = new GraphQLObjectType({
  name: 'NewsRelatedLink',
  fields: {
    title: {
      type: GraphQLString,
      description: 'Label of the link',
    },
    url: {
      type: GraphQLString,
      description: 'Full URL of the link',
    },
  },
});

const NewsDateTimeType = new GraphQLObjectType({
  name: 'NewsDateTime',
  fields: {
    iso: {
      type: GraphQLString,
      description: 'Full date time in ISO format',
    },
    date: {
      type: GraphQLString,
      description: 'Numeric representation of the date of the news article',
    },
    month: {
      type: GraphQLString,
      description: 'Numeric representation of the month of the news article',
    },
    monthSym: {
      type: GraphQLString,
      description: 'Symbolic representation of the date of the news article',
    },
    year: {
      type: GraphQLString,
      description: 'Numeric representation of the year of the news article',
    },
  },
});

const NewsBodyStructuredTextType = new GraphQLObjectType({
  name: 'NewsBodyStructuredText',
  fields: {
    type: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
  },
});

const NewsType = new GraphQLObjectType({
  name: 'News',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique id of news article',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'List of tags related the news article',
    },
    title: {
      type: GraphQLString,
      description: 'News title',
    },
    strapline: {
      type: GraphQLString,
      description: 'Brief description of the news article',
    },
    internalLinks: {
      type: new GraphQLList(NewsRelatedLinkType),
      description: 'List of related internal links',
    },
    externalLinks: {
      type: new GraphQLList(NewsRelatedLinkType),
      description: 'List of related external links',
    },
    datetime: {
      type: NewsDateTimeType,
    },
    body: {
      type: new GraphQLList(NewsBodyStructuredTextType),
      description: 'Structured body with full description of the news',
    },
    featureImageFilename: {
      type: GraphQLString,
      description: 'Filename of an image uploaded to a 3rd party hosting service',
    },
  },
});

export const NewsSchemaFields = {
  news: {
    type: NewsType,
    description: 'Request a single Red Badger news article by its ID',
    args: {
      id: { type: GraphQLString },
    },
    resolve: NewsFetch,
  },
  allNews: {
    type: new GraphQLList(NewsType),
    description: 'Request all Red Badger news',
    resolve: AllNewsFetch,
  },
};
