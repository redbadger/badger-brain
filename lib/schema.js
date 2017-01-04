import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { BasicEventSchemaFields } from './basicEvent';
import { NewsSchemaFields } from './news/newsFields';
import { CommunitySchemaFields } from './community/communityFields';
import { SpeakerSchemaFields } from './speaker/speakerFields';
import { TicketSchemaFields } from './ticket/ticketFields';
import { TalkSchemaFields } from './talk/talkFields';
import { OrganisationSchemaFields } from './organisation';
import { BadgerSchemaFields } from './badger/badgerFields';

export const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: Object.assign(
      BasicEventSchemaFields,
      NewsSchemaFields,
      CommunitySchemaFields,
      TicketSchemaFields,
      SpeakerSchemaFields,
      TalkSchemaFields,
      OrganisationSchemaFields,
      BadgerSchemaFields,
    ),
  }),
});
