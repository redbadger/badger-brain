import { GraphQLString, GraphQLList, GraphQLObjectType } from 'graphql';
import { fetchAllQnA } from '../fetch';

const QnATopicType = new GraphQLObjectType({
  name: 'QnATopic',
  fields: {
    question: {
      type: GraphQLString,
      description: 'Full text of the question',
    },
    answer: {
      type: GraphQLString,
      description: 'Full text of the answer',
    },
  },
});

const QnACategoryType = new GraphQLObjectType({
  name: 'QnACategory',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The id of the Q and A item',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the category',
    },
    slug: {
      type: GraphQLString,
      description: 'The slug of the category',
    },
    topics: {
      type: new GraphQLList(QnATopicType),
      description: 'List of Q and A topics on this category',
      resolve(category) {
        console.log('RESOLVING CATEGORY TOPICS', JSON.stringify(category));
        return [];
      },
    },
  },
});

const QnAType = new GraphQLObjectType({
  name: 'allQnATopics',
  fields: {
    QnA: {
      type: new GraphQLList(QnACategoryType),
    },
  },
});

export const QnASchemaFields = {
  allQnA: {
    type: QnAType,
    description: 'All Q and A topics grouped by categories',
    resolve: fetchAllQnA,
  },
};
