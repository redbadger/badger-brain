import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import _ from 'lodash';
import { fetchTalk, fetchAllTalks, getDocumentById, sanitizeSpeaker } from '../fetch';

import { SpeakerType } from '../speaker/speakerFields';

export const TalkType = new GraphQLObjectType({
  name: 'Talk',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the talk',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the talk',
    },
    summary: {
      type: GraphQLString,
      description: 'A summary of the talk',
    },
    speakers: {
      type: new GraphQLList(SpeakerType),
      description: 'List of speakers giving the talk',
      resolve(talk) {
        if (talk.speakers) {
          return talk.speakers.map((result) => {
            const id = _.get(result, 'data.value.document.id', '');
            return getDocumentById(id, 'speaker', sanitizeSpeaker);
          });
        }
        return [];
      },
    },
  },
});

export const TalkSchemaFields = {
  talk: {
    type: TalkType,
    description: 'Request a talk by id',
    args: {
      id: { type: GraphQLString },
    },
    resolve: fetchTalk,
  },
  allTalks: {
    type: new GraphQLList(TalkType),
    description: 'Request all talks',
    resolve: fetchAllTalks,
  },
};
