import {
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql';
import OrganisationInterface, {
  organisationTypeFields,
} from '../interfaces/organisation';

export const DEFAULT_PARTNER_LEVEL = 'Supporter';

const LevelType = new GraphQLEnumType({
  name: 'LevelType',
  values: {
    Supporter: { value: 'Supporter' },
    Gold: { value: 'Gold' },
    Silver: { value: 'Silver' },
    Bronze: { value: 'Bronze' },
  },
});

export const EventPartnerType = new GraphQLObjectType({
  name: 'EventPartner',
  interfaces: [
    OrganisationInterface,
  ],
  fields: {
    ...organisationTypeFields,
    level: {
      name: 'level',
      type: LevelType,
      resolve({ level }) {
        return level || DEFAULT_PARTNER_LEVEL;
      },
    },
  },
});
