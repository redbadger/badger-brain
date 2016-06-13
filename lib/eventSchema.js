import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';

import { EventFetch, AllEventsFetch } from './eventFetch.js';

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

const EventBodyStructuredTextType = new GraphQLObjectType({
  name: 'EventBodyStructuredText',
  fields: {
    type: {
      type: GraphQLString
    },
    text: {
      type: GraphQLString
    }
  }
});

const EventType = new GraphQLObjectType ({
  name: 'Event',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique id of event'
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
    },
    body: {
      type: new GraphQLList(EventBodyStructuredTextType)
    }
  }
});

export const EventSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      event: {
        type: EventType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: EventFetch
      },
      allEvents: {
        type: new GraphQLList(EventType),
        resolve: AllEventsFetch
      }
    }
  })
});
