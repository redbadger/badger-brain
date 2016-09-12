import {
  GraphQLString,
  GraphQLList,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';

import { mapItemList } from '../../resolvers';
import { OrganisationType } from '../../organisation';

export const JobType = new GraphQLObjectType({
  name: 'JobType',
  fields: {
    title: {
      type: GraphQLString,
      description: 'The job title',
    },
    location: {
      type: GraphQLString,
      description: 'The job location',
    },
    description: {
      type: GraphQLString,
      description: 'The job description',
    },
    jobURL: {
      type: GraphQLString,
      description: 'A link to more information about the job',
    },
  },
});

export const organisationTypeFields = {
  id: {
    type: GraphQLString,
    description: 'Unique id of organisation',
  },
  name: {
    type: GraphQLString,
    description: 'Name of organisation',
  },
  description: {
    type: GraphQLString,
    description: 'Description of organisation',
  },
  url: {
    type: GraphQLString,
    description: 'URL for organisation homepage',
  },
  partnerURL: {
    type: GraphQLString,
    description: 'DEPRECATED: Use url', // TODO: Remove
  },
  imageURL: {
    type: GraphQLString,
    description: 'URL for organisation logo',
  },
  jobs: {
    type: new GraphQLList(JobType),
    description: 'List of organisation jobs',
    resolve: mapItemList('jobs'),
  },
};

export default new GraphQLInterfaceType({
  name: 'OrganisationInterface',
  fields: organisationTypeFields,
  resolveType: () => OrganisationType,
});
