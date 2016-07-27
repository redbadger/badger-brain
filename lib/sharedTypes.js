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

export const CoordinateType = new GraphQLObjectType({
  name: 'CoordinateType',
  fields: {
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

export const LocationType = new GraphQLObjectType({
  name: 'LocationType',
  fields: {
    address: {
      type: GraphQLString,
      description: 'The mailing address of the location',
    },
    coordinates: {
      type: CoordinateType,
      description: 'The coordinates of the location',
    },
  },
});

export const ScheduleItemType = new GraphQLObjectType({
  name: 'ScheduleItemType',
  fields: {
    datetime: {
      type: GraphQLString,
      description: 'The datetime of the schedule item',
    },
    text: {
      type: GraphQLString,
      description: 'The text description of the schedule item',
    },
  },
});

export const SponsorItemType = new GraphQLObjectType({
  name: 'SponsorItemType',
  fields: {
    websiteURL: {
      type: GraphQLString,
      description: 'The website address of the event sponsor',
    },
    imageURL: {
      type: GraphQLString,
      description: 'The logo url of the event sponsor',
    },
    name: {
      type: GraphQLString,
      description: 'Name of the sponsor',
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
    type: {
      type: GraphQLString,
      description: 'Type of the link',
    },
  },
});
