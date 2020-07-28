import fetch from 'node-fetch';
import sanitize from './sanitize';

export default async function fetchAllInstagramPosts() {
  // Facebook changed the way their API works it wants us to access
  // It's API by creating an app that the RB account with need to authorize
  // On it's instagram account. That seems a bit over the top
  // to get a few posts. Fortunately ther `?__a=1` param can be added to
  // ANy instagram page to view it as JSON.
  const response = await fetch(
    'https://www.instagram.com/redbadgerteam/?__a=1'
  );
  const results = await response.json();
  // Just select the most recent 5 posts
  return results.graphql.user.edge_owner_to_timeline_media.edges
    .slice(0, 5)
    .map((item) => sanitize(item.node));
}
