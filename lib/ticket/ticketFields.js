import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import {
  fetchTicket,
} from '../fetch';

import {
  DateTimeType,
} from '../sharedTypes';

export const TicketType = new GraphQLObjectType({
  name: 'Ticket',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the ticket',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the ticket',
    },
    releaseDate: {
      type: DateTimeType,
      description: 'Date and time of the ticket release',
    },
    price: {
      type: GraphQLString,
      description: 'The price of the ticket',
    },
    available: {
      type: GraphQLBoolean,
      description: 'The availability of the ticket',
    },
  },
});

export const TicketSchemaFields = {
  ticket: {
    type: TicketType,
    description: 'Ticket for an event',
    resolve: (source, args) => fetchTicket(args),
  },
};
