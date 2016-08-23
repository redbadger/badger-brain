import {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { fetchAllPartners, fetchPartner } from '../fetch';
import PartnerInterface, { partnerTypeFields } from '../interfaces/partner';

export const BasicPartnerType = new GraphQLObjectType({
  name: 'BasicPartner',
  interfaces: () => [
    PartnerInterface,
  ],
  fields: () => ({
    ...partnerTypeFields,
  }),
});

export const BasicPartnerSchemaFields = {
  partner: {
    type: BasicPartnerType,
    description: 'Request a partner by their id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: (source, args) => fetchPartner(args),
  },
  allPartners: {
    type: new GraphQLList(BasicPartnerType),
    description: 'Request all partners',
    resolve: fetchAllPartners,
  },
};
