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
      description: 'The last name of the badger',
    },
    about: {
      type: GraphQLString,
      description: 'A summary of the badger',
    },
    skills: {
      type: GraphQLString,
      description: 'Signature skills of the badger',
    },
    influence: {
      type: GraphQLString,
      description: 'Life changing books/films/experiences of the badger',
    },
    achievements: {
      type: GraphQLString,
      description: 'Achievements of the badger',
    },
    linkedin: {
      type: GraphQLString,
      description: 'The LinkedIn profile of the badger',
    },
    twitter: {
      type: GraphQLString,
      description: 'The Twitter profile of the badger',
    },
    github: {
      type: GraphQLString,
      description: 'The Github profile of the badger',
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
