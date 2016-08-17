import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import { fetchAllPartners } from '../fetch';

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
  allPartners: {
    type: new GraphQLList(PartnerType),
    description: 'Request all partners',
    resolve: fetchAllPartners,
  },
};
