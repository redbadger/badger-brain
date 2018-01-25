import { GraphQLString, GraphQLObjectType } from 'graphql';
import { fetchEventsBanner } from '../fetch';

const EventsBannerType = new GraphQLObjectType({
  name: 'EventsBanner',
  fields: {
    url: {
      type: GraphQLString,
      description: 'URL banner links to',
    },
    desktopImageURL: {
      type: GraphQLString,
      description: 'A URL linking to the desktop image',
    },
    tabletImageURL: {
      type: GraphQLString,
      description: 'A URL linking to the tablet image',
    },
    mobileImageURL: {
      type: GraphQLString,
      description: 'A URL linking to the mobile image',
    },
  },
});

export const EventsBannerFields = {
  eventsBanner: {
    type: EventsBannerType,
    description: 'Request events banner',
    resolve: fetchEventsBanner,
  },
};
