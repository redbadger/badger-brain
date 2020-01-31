import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { HubspotForm } from '../hubspotForm/hubspotFormFields';
import { fetchAllGoldCoinPages } from '../fetch';

const GoldCoinImage = new GraphQLObjectType({
  name: 'goldCoinImage',
  fields: {
    main: {
      type: GraphQLString,
      description: 'The main image associated with the page',
    },
    large: {
      type: GraphQLString,
      description: 'The large sized image associated with the page',
    },
    medium: {
      type: GraphQLString,
      description: 'The medium sized image associated with the page',
    },
    small: {
      type: GraphQLString,
      description:
        'The small sized image associated with the page, will also be used in previews',
    },
  },
});

export const GoldCoinPage = new GraphQLObjectType({
  name: 'goldCoinPage',
  fields: {
    slug: {
      type: GraphQLString,
      description: 'The unique slug for the gold coin page',
    },
    title: {
      type: GraphQLString,
      description: 'The main title for the page',
    },
    subTitle: {
      type: GraphQLString,
      description: 'The tag line for the page',
    },
    headerImage: {
      type: GoldCoinImage,
      description: `The image set associated with the page,
        includes the origina (main) image and large,
        medium and small variations`,
    },
    headerAlt: {
      type: GraphQLString,
      description: 'The alt text describing the header image',
    },
    duration: {
      type: GraphQLString,
      description: 'How long this engagement typically takes',
    },
    price: {
      type: GraphQLString,
      description: 'How much this engagement would cost',
    },
    type: {
      type: GraphQLString,
      description: 'The type of engagement',
    },
    location: {
      type: GraphQLString,
      description: 'Where it will take place',
    },
    whatIsIt: {
      type: GraphQLString,
      description: 'Rich text outlining the specifics of the engagement',
    },
    whoIsItFor: {
      type: GraphQLString,
      description:
        'Rich text describing who this engagmenet is best suited for',
    },
    whatWillYouLearn: {
      type: GraphQLString,
      description:
        'Rich text describing what you will get from this engagement',
    },
    whoWillRun: {
      type: GraphQLString,
      description: 'Rich text outlinign who will run the session',
    },
    consultants: {
      type: new GraphQLList(GraphQLString),
      description:
        'Slugs of the Consultant(s)/Badger(s) who will conduct the session',
    },
    hubspotForm: {
      type: HubspotForm,
      description: 'The associated hubspot form for lead capture',
    },
  },
});

export const GoldCoinPageSchemaFields = {
  allGoldCoinPages: {
    type: new GraphQLList(GoldCoinPage),
    description: 'Request all gold coin pages',
    resolve: fetchAllGoldCoinPages,
  },
};
