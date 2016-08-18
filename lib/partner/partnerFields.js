import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import { JobType } from '../sharedTypes';
import { fetchAllPartners, fetchPartner } from '../fetch';
import { mapItemList } from '../resolvers';

const PartnerTypeFields = {
  id: {
    type: GraphQLString,
    description: 'Unique id of partner',
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'Name of partner',
  },
  description: {
    type: GraphQLString,
    description: 'Description of partner',
  },
  partnerURL: {
    type: GraphQLString,
    description: 'URL for partner homepage',
  },
  imageURL: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'URL for partner logo',
  },
  jobs: {
    type: new GraphQLList(JobType),
    description: 'List of partner jobs',
    resolve: mapItemList('jobs'),
  },
};

export const PartnerType = new GraphQLObjectType({
  name: 'Partner',
  fields: {
    ...PartnerTypeFields,
  },
});

const DEFAULT_PARTNER_LEVEL = 'Supporter';

export const EventPartnerType = new GraphQLObjectType({
  name: 'EventPartner',
  fields: {
    ...PartnerTypeFields,
    level: {
      name: 'level',
      type: GraphQLString,
      resolve({ level }) {
        return level || DEFAULT_PARTNER_LEVEL;
      },
    },
  },
});

export const PartnerSchemaFields = {
  partner: {
    type: PartnerType,
    description: 'Request a partner by their id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: (source, args) => fetchPartner(args),
  },
  allPartners: {
    type: new GraphQLList(PartnerType),
    description: 'Request all partners',
    resolve: fetchAllPartners,
  },
};
