import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import {
  fetchBadger,
  fetchAllBadgers,
} from '../fetch';

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: {
    name: {
      type: GraphQLString,
      description: 'The name of the category',
    },
    slug: {
      type: GraphQLString,
      description: 'The slug of the category',
    },
    order: {
      type: GraphQLInt,
      description: 'The order number of the category',
    },
  },
});

export const BadgerType = new GraphQLObjectType({
  name: 'Badger',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the badger',
    },
    slug: {
      type: GraphQLString,
      description: 'The slug of the badger',
    },
    firstName: {
      type: GraphQLString,
      description: 'The first name of the badger',
    },
    lastName: {
      type: GraphQLString,
      description: 'The last name of the badger',
    },
    order: {
      type: GraphQLInt,
      description: 'The order number of the badger',
    },
    jobTitle: {
      type: GraphQLString,
      description: 'The job title of the badger',
    },
    startDate: {
      type: GraphQLString,
      description: 'The start date of the badger',
    },
    primaryImageUrl: {
      type: GraphQLString,
      description: 'The image url of the badger',
    },
    secondaryImageUrl: {
      type: GraphQLString,
      description: 'Secondary image url of the badger',
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
    squarespaceId: {
      type: GraphQLString,
      description: 'The author id of the badger on Squarespace',
    },
    categories: {
      type: new GraphQLList(CategoryType),
      description: 'The categories of the badger',
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
