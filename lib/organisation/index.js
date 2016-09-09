import {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { fetchAllOrganisations, fetchOrganisation } from '../fetch';
import OrganisationInterface, { organisationTypeFields } from '../interfaces/organisation';

export const OrganisationType = new GraphQLObjectType({
  name: 'Organisation',
  interfaces: () => [
    OrganisationInterface,
  ],
  fields: () => ({
    ...organisationTypeFields,
  }),
});

export const OrganisationSchemaFields = {
  organisation: {
    type: OrganisationType,
    description: 'Request a organisation by their id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: (source, args) => fetchOrganisation(args),
  },
  allOrganisations: {
    type: new GraphQLList(OrganisationType),
    description: 'Request all organisations',
    resolve: fetchAllOrganisations,
  },
};
