import {
  GraphQLString,
  GraphQLList,
  GraphQLInterfaceType,
} from 'graphql';

import { OrganisationType } from '../../organisation';
import { JobType } from '../../job';
import organisationJobsResolver from '../../resolvers/organisation-jobs';

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
    description: 'List of Jobs open at the organisation.',
    resolve: organisationJobsResolver,
  },
};

export default new GraphQLInterfaceType({
  name: 'OrganisationInterface',
  fields: organisationTypeFields,
  resolveType: () => OrganisationType,
});
