import { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLInt } from 'graphql';
import { pathOr } from 'ramda';
import { fetchAllQnA, fetchQnATopic } from '../fetch';

const QnATopicType = new GraphQLObjectType({
  name: 'QnATopic',
  fields: {
    slug: {
      type: GraphQLString,
      description: 'Slug of the topic',
    },
    question: {
      type: GraphQLString,
      description: 'Full text of the question',
    },
    answer: {
      type: GraphQLString,
      description: 'Full text of the answer',
    },
    order: {
      type: GraphQLInt,
      description: 'Order of the item',
    },
  },
});

const QnACategoryType = new GraphQLObjectType({
  name: 'QnACategory',
  fields: {
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
        if (category.topics) {
          return category.topics.map(result => {
            const id = pathOr('', ['data', 'value', 'document', 'id'], result);
            return fetchQnATopic({ id });
          });
        }
        return [];
      },
    },
    order: {
      type: GraphQLInt,
      description: 'Order of the item',
    },
  },
});

export const QnASchemaFields = {
  allQnA: {
    type: new GraphQLList(QnACategoryType),
    description: 'All Q and A topics grouped by categories',
    resolve: fetchAllQnA,
  },
};
