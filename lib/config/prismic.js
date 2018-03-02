export const PrismicConfig = {
  apiEndpoint: process.env.APP_ENV === 'production' ? 'https://rb-website.cdn.prismic.io/api' : 'https://rb-website-stage.cdn.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver: (doc, ctx) => '/', // eslint-disable-line no-unused-vars
};
