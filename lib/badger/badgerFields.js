import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import {
  fetchBadger,
  fetchAllBadgers,
} from '../fetch';

export const BadgerType = new GraphQLObjectType({
  name: 'Badger',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the badger',
    },
    firstName: {
      type: GraphQLString,
      description: 'The first name of the badger',
    },
    lastName: {
      type: GraphQLString,
      description: 'A summary of the badger',
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'dfsdf',
    },
  },
});

export const BadgerSchemaFields = {
  badger: {
    type: BadgerType,
    description: 'Request a badger by id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: (source, args) => fetchBadger(args),
  },
  allBadgers: {
    type: new GraphQLList(BadgerType),
    description: 'Request all badgers',
    resolve: fetchAllBadgers,
  },
};
