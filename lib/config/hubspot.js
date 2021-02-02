require('dotenv').config();
function constructFormEndpoint(formId) {
  return `https://api.hubapi.com/forms/v2/forms/${formId}?hapikey=${process.env.HUBSPOT_API_KEY}`;
}
export const HubspotConfig = {
  blogApiEndpoint: `${process.env.HUBSPOT_BLOG_ENDPOINT}?hapikey=${process.env.HUBSPOT_API_KEY}`,
  blogAuthorsApiEndPoint: `${process.env.HUBSPOT_BLOG_AUTHORS_ENDPOINT}?hapikey=${
    process.env.HUBSPOT_API_KEY
  }`,
  formsApiEndpoint: constructFormEndpoint,
};
