require('dotenv').config();
export const HubspotConfig = {
  blogApiEndpoint: `${process.env.HUBSPOT_BLOG_ENDPOINT}?hapikey=${
    process.env.HUBSPOT_API_KEY
  }`,
};
