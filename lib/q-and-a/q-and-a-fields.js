import { GraphQLString, GraphQLList, GraphQLObjectType } from 'graphql';
import { fetchAllQnA } from '../fetch';

const QnATopicType = new GraphQLObjectType({
  name: 'Q and A topic',
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
  name: 'Category',
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
  },
});

const QnAType = new GraphQLObjectType({
  name: 'All Q and A topics grouped by categories',
  fields: {
    QnA: {
      type: GraphQLList(QnACategoryType),
    },
  },
});

export const QnASchemaFields = new GraphQLObjectType({
  type: QnAType,
  description: 'All Q and A topics grouped by categories',
  resolve: fetchAllQnA,
});
