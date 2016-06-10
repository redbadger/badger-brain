import Prismic from 'prismic.io';
import dateFns from 'date-fns';

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

    const d = new Date(event.data["event.timestamp"]["value"])
    const eventDate = {
      iso: event.data["event.timestamp"]["value"],
      date: dateFns.getDate(d),
      month: dateFns.getMonth(d),
      monthSym: dateFns.format(d, 'MMM'),
      year: dateFns.getYear(d)
    };

    return {
      id: event.id,
      slug: event.slug,
      title: event.data["event.title"]["value"],
      strapline: event.data["event.strapline"]["value"],
      datetime: eventDate
    };
  });
}
