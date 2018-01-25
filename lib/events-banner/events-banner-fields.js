import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
import { fetchEventsBanner } from '../fetch';

const EventsBannerType = new GraphQLObjectType({
  name: 'EventsBanner',
  fields: {
    url: {
      type: GraphQLString,
      description: 'URL banner links to',
    },
    altText: {
      type: GraphQLString,
      description: 'Alt text for banner image',
    },
    desktopURL: {
      type: GraphQLString,
      description: 'A URL linking to the desktop image',
    },
    tabletURL: {
      type: GraphQLString,
      description: 'A URL linking to the tablet image',
    },
    mobileURL: {
      type: GraphQLString,
      description: 'A URL linking to the mobile image',
    },
  },
});

export const EventsBannerFields = {
  eventsBanner: {
    type: new GraphQLList(EventsBannerType),
    description: 'Request events banner',
    resolve: fetchEventsBanner,
  },
};
