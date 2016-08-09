import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { BasicEventSchemaFields } from './basicEvent';
import { NewsSchemaFields } from './news/newsFields';
import { CommunitySchemaFields } from './community/communityFields';
import { SpeakerSchemaFields } from './speaker/speakerFields';
import { TalkSchemaFields } from './talk/talkFields';

export const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: Object.assign(
      BasicEventSchemaFields,
      NewsSchemaFields,
      CommunitySchemaFields,
      SpeakerSchemaFields,
      TalkSchemaFields,
    ),
  }),
});
