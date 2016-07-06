import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { EventSchemaFields } from './eventFields';
import { NewsSchemaFields } from './newsFields';
import { CommunitySchemaFields } from './communityFields';
import { SpeakerSchemaFields } from './speakerFields';

export const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: Object.assign(
      EventSchemaFields,
      NewsSchemaFields,
      CommunitySchemaFields,
      SpeakerSchemaFields
    ),
  }),
});
