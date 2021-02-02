import { GraphQLString, GraphQLList, GraphQLObjectType } from 'graphql';

import { fetchAllJobs } from '../fetch';

export const JobsItemType = new GraphQLObjectType({
  name: 'JobsItem',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique id of the job item',
    },
    title: {
      type: GraphQLString,
      description: 'Job title',
    },
    description: {
      type: GraphQLString,
      description: 'Job short description',
    },
    fullDescription: {
      type: GraphQLString,
      description: 'Job full description',
    },
    department: {
      type: GraphQLString,
      description: 'Job department',
    },
    applicationUrl: {
      type: GraphQLString,
      description: 'Job application url',
    },
    slug: {
      type: GraphQLString,
      description: 'Job slug',
    },
    datePosted: {
      type: GraphQLString,
      description: 'Job posted at',
    },
  },
});

export const JobsSchemaFields = {
  allJobs: {
    type: new GraphQLList(JobsItemType),
    description: 'Request all Red Badger Jobs',
    resolve: fetchAllJobs,
  },
};
