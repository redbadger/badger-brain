import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';

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

export const EventSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      event: {
        type: EventType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: function (_, args) {
          return {
            id: 1,
            title: 'Test event',
            strapline: 'Short description'
          };
        }
      }
    }
  })
});
