import Prismic from 'prismic.io';

export function EventFetch(_, args) {

  return {
    id: 1,
    title: 'Test event',
    strapline: 'Short description'
  };
}

export async function AllEventsFetch() {
  let r = await Prismic.api("https://rb-website.prismic.io/api").then(function(api) {
    return api.form('everything').ref(api.master()).query(Prismic.Predicates.at("document.type", "event")).pageSize(5).submit();
  }).then(function(response) {
    return response;
  }, function(err) {
    console.log('ERR', err);
  });

  return r.results.map(function(event) {
    return {
      id: event.id,
      slug: event.slug,
      title: event.data["event.title"]["value"],
      strapline: event.data["event.strapline"]["value"]
    };
  });
}
