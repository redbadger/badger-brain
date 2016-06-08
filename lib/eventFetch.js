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
    return api.form('everything').ref(api.master()).query(Prismic.Predicates.at("document.type", "event")).pageSize(100).submit();
  }).then(function(response) {
    return response;
  }, function(err) {
    console.log('ERR', err);
  });

  console.log(JSON.stringify(r.results));

  return [
    {
      title: 'Event 1'
    },
    {
      title: 'Event 2'
    }
  ];
}
