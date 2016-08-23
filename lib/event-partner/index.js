import {
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql';
import PartnerInterface, { partnerTypeFields } from '../interfaces/partner';

const DEFAULT_PARTNER_LEVEL = 'Supporter';

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
    PartnerInterface,
  ],
  fields: {
    ...partnerTypeFields,
    level: {
      name: 'level',
      type: LevelType,
      resolve({ level }) {
        return level || DEFAULT_PARTNER_LEVEL;
      },
    },
  },
});
