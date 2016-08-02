import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { pathOr } from 'ramda';
import { SpeakerType } from '../speaker/speakerFields';
import {
  fetchTalk,
  fetchAllTalks,
  fetchSpeaker,
} from '../fetch';

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
            const id = pathOr('', ['data', 'value', 'document', 'id'], result);
            return fetchSpeaker(undefined, { id });
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
