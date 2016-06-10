import Prismic from 'prismic.io';
import dateFns from 'date-fns';

export async function EventFetch(_, args) {
  let r = await Prismic.api("https://rb-website.prismic.io/api").then(function(api) {
    return api.form('everything').ref(api.master()).query(Prismic.Predicates.at("document.id", args.id)).submit();
  }).then(function(response) {
    return response;
  }, function(err) {
    console.log('ERR', err);
  });

  if(r.results.length > 0) {
    return {
      id: r.results[0].id,
      slug: r.results[0].uid,
      title: r.results[0].data["event.title"]["value"],
      strapline: r.results[0].data["event.strapline"]["value"],
      body: r.results[0].data["event.body"]["value"]
    }
  }

  return {};
}

export async function AllEventsFetch() {
  let r = await Prismic.api("https://rb-website.prismic.io/api").then(function(api) {
    return api.form('everything').ref(api.master()).query(Prismic.Predicates.at("document.type", "event")).pageSize(5).submit();
  }).then(function(response) {
    return response;
  }, function(err) {
    console.log('ERR', err);
  });

  if(r.results.length > 0) {
    return r.results.map(function(event) {

      const d = new Date(event.data["event.timestamp"]["value"])
      const eventDate = {
        iso: event.data["event.timestamp"]["value"],
        date: dateFns.getDate(d),
        month: dateFns.getMonth(d),
        monthSym: dateFns.format(d, 'MMM'),
        year: dateFns.getYear(d)
      };

      let externalLinks = [];
      if(event.data["event.externalLinks"]) {
        externalLinks = event.data["event.externalLinks"]["value"].map(function(eventLink) {
          return {
            title: eventLink.label.value,
            url: eventLink.link.value
          };
        })
      }

      let internalLinks = [];
      if(event.data["event.internalLinks"]) {
        externalLinks = event.data["event.internalLinks"]["value"].map(function(eventLink) {
          return {
            title: eventLink.label.value,
            url: eventLink.link.value
          };
        })
      }

      return {
        id: event.id,
        slug: event.slug,
        title: event.data["event.title"]["value"],
        strapline: event.data["event.strapline"]["value"],
        datetime: eventDate,
        internalLinks,
        externalLinks,
        body: event.data["event.body"]["value"]
      };
    });
  } else {
    return {};
  }
}
