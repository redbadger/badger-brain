import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import { fetchHubspotForm, fetchHubspotFormsById } from '../fetch';

const HubspotFormFieldOptions = new GraphQLObjectType({
  name: 'HubspotFormFieldOptions',
  fields: {
    value: {
      type: GraphQLString,
      descriptions: 'The value for the given dropdown item',
    },
    hidden: {
      type: GraphQLBoolean,
      descriptions: 'Is this a hidden value?',
    },
  },
});

const HubspotFormConsentCheckbox = new GraphQLObjectType({
  name: 'HubspotFormConsentCheckbox',
  fields: {
    label: {
      type: GraphQLString,
      description: 'Agreement text for checking box.',
    },
    required: {
      type: GraphQLBoolean,
      description: 'Is this checkbox required top complete the form?',
    },
  },
});

const HubspotFormConsentField = new GraphQLObjectType({
  name: 'HubspotFormConsentField',
  fields: {
    consentMessage: {
      type: GraphQLString,
      description: 'Important consent text the user is agreeing to.',
    },
    checkboxes: {
      type: new GraphQLList(HubspotFormConsentCheckbox),
      description: 'Accompanying checkbox for this consent agreement.',
    },
  },
});

const HubspotFormField = new GraphQLObjectType({
  name: 'HubspotFormField',
  fields: {
    richText: {
      type: GraphQLString,
      description: 'Any extra html supplied with this field.',
    },
    name: {
      type: GraphQLString,
      description: 'The internal name of this field.',
    },
    label: {
      type: GraphQLString,
      description: 'The displayed menu for this field.',
    },
    fieldType: {
      type: GraphQLString,
      description: 'The type of input for this field.',
    },
    description: {
      type: GraphQLString,
      description: 'The description of this field.',
    },
    defaultValue: {
      type: GraphQLString,
      description: 'The default value for this field.',
    },
    placeholder: {
      type: GraphQLString,
      description: 'The placeholder for this field.',
    },
    options: {
      type: new GraphQLList(HubspotFormFieldOptions),
      description: 'The available options for a drop down list style input',
    },
    required: {
      type: GraphQLBoolean,
      description: 'Is this field required?',
    },
    enabled: {
      type: GraphQLBoolean,
      description: 'Is this field enabled by default?',
    },
    hidden: {
      type: GraphQLBoolean,
      description: 'Is this field hidden?',
    },
    labelHidden: {
      type: GraphQLBoolean,
      description: 'Is the label for this field hidden?',
    },
  },
});

export const HubspotForm = new GraphQLObjectType({
  name: 'HubspotForm',
  fields: {
    portalId: {
      type: GraphQLFloat,
      description: 'The id of the portal that this form belongs to.',
    },
    guid: {
      type: GraphQLString,
      description: 'The id of the form itself.',
    },
    name: {
      type: GraphQLString,
      description: 'The internal name of the form.',
    },
    cssClass: {
      type: GraphQLString,
      description: 'The css classes supplied by hubspot for this form.',
    },
    submitText: {
      type: GraphQLString,
      description: 'The text displayed on the submit button.',
    },
    inlineMessage: {
      type: GraphQLString,
      description: 'The message displayed once the form is submitted.',
    },
    formFields: {
      type: new GraphQLList(HubspotFormField),
      description: 'The fields supplied for the form.',
    },
    formConsent: {
      type: HubspotFormConsentField,
      description: 'GDPR compliant consent message.',
    },
  },
});

export const HubspotFormSchemaFields = {
  hubspotForm: {
    type: HubspotForm,
    description: 'Request a hubspot form by id',
    args: {
      id: {
        type: GraphQLString,
        description: 'Returns the hubspot form that matches the id',
      },
    },
    resolve: (source, args) => fetchHubspotForm(args),
  },
  hubspotFormsById: {
    type: new GraphQLList(HubspotForm),
    description: 'Retrieve all forms for selected IDs',
    args: {
      ids: {
        type: new GraphQLList(GraphQLString),
        description: 'Returns an array of forms that match the supplied ids',
      },
    },
    resolve: (source, args) => fetchHubspotFormsById(args),
  },
};
