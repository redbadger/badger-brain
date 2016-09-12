import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

export const JobType = new GraphQLObjectType({
  name: 'Job',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Unique id of job',
    },
    title: {
      type: GraphQLString,
      description: 'Job title, i.e. "Software Engineer"',
    },
    location: {
      type: GraphQLString,
      description: 'job location, i.e. "london, uk"',
    },
    description: {
      type: GraphQLString,
      description: 'A short description of job.',
    },
    jobURL: {
      type: GraphQLString,
      description: 'A link to more information on the job',
    },
  },
});
