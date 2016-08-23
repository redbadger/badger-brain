import {
  GraphQLString,
  GraphQLList,
  GraphQLInterfaceType,
} from 'graphql';

import { JobType } from '../../sharedTypes';
import { mapItemList } from '../../resolvers';
import { BasicPartnerType } from '../../basic-partner';

export const partnerTypeFields = {
  id: {
    type: GraphQLString,
    description: 'Unique id of partner',
  },
  name: {
    type: GraphQLString,
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
    type: GraphQLString,
    description: 'URL for partner logo',
  },
  jobs: {
    type: new GraphQLList(JobType),
    description: 'List of partner jobs',
    resolve: mapItemList('jobs'),
  },
};

export default new GraphQLInterfaceType({
  name: 'Partner',
  fields: partnerTypeFields,
  resolveType: () => BasicPartnerType,
});
