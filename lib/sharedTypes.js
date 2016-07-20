import { GraphQLString, GraphQLObjectType } from 'graphql';

export const BodyStructuredTextType = new GraphQLObjectType({
  name: 'BodyStructuredText',
  fields: {
    type: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
  },
});

export const LocationType = new GraphQLObjectType({
  name: 'LocationType',
  fields: {
    address: {
      description: 'The mailing address of the location',
      type: GraphQLString,
    },
    longitude: {
      type: GraphQLString,
      description: 'The longitude of the location',
    },
    latitude: {
      type: GraphQLString,
      description: 'The latitude of the location',
    },
  },
});

export const DateTimeType = new GraphQLObjectType({
  name: 'DateTime',
  fields: {
    iso: {
      type: GraphQLString,
      description: 'Full date time in ISO format',
    },
    date: {
      type: GraphQLString,
      description: 'Numeric representation of the date',
    },
    month: {
      type: GraphQLString,
      description: 'Numeric representation of the month',
    },
    monthSym: {
      type: GraphQLString,
      description: 'Symbolic representation of the date',
    },
    year: {
      type: GraphQLString,
      description: 'Numeric representation of the year',
    },
  },
});

export const RelatedLinkType = new GraphQLObjectType({
  name: 'RelatedLink',
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
