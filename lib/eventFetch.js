import Prismic from 'prismic.io';
import dateFns from 'date-fns';
import { PrismicConfig } from '../config/prismic.js';

export async function EventFetch(_, args) {
  let r = await Prismic.api(PrismicConfig.apiEndpoint).then(function(api) {
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
      body: r.results[0].data["event.body"]["value"],
      datetime: mapEventDate(r.results[0].data["event.timestamp"]["value"]),
      internalLinks: r.results[0].data["event.internalLinks"] ? mapLinkList(r.results[0].data["event.internalLinks"]["value"]) : [],
      externalLinks: r.results[0].data["event.externalLinks"] ? mapLinkList(r.results[0].data["event.externalLinks"]["value"]) : [],
      featureImageFilename: event.data["event.event-image"]["value"]
    }
  }

  return {};
}

export async function AllEventsFetch() {
  let r = await Prismic.api(PrismicConfig.apiEndpoint).then(function(api) {
    return api.form('everything').ref(api.master()).query(Prismic.Predicates.at("document.type", "event")).pageSize(5).submit();
  }).then(function(response) {
    return response;
  }, function(err) {
    console.log('ERR', err);
  });

  if(r.results.length > 0) {
    return r.results.map(function(event) {
      return {
        id: event.id,
        slug: event.slug,
        title: event.data["event.title"]["value"],
        strapline: event.data["event.strapline"]["value"],
        datetime: mapEventDate(event.data["event.timestamp"]["value"]),
        internalLinks: event.data["event.internalLinks"] ? mapLinkList(event.data["event.internalLinks"]["value"]) : [],
        externalLinks: event.data["event.externalLinks"] ? mapLinkList(event.data["event.externalLinks"]["value"]) : [],
        body: event.data["event.body"]["value"],
        featureImageFilename: event.data["event.event-image"]["value"]
      };
    });
  } else {
    return {};
  }
}

function mapEventDate(timestamp) {
  const d = new Date(timestamp)
  return {
    iso: timestamp,
    date: dateFns.getDate(d),
    month: dateFns.getMonth(d),
    monthSym: dateFns.format(d, 'MMM'),
    year: dateFns.getYear(d)
  };
}

function mapLinkList(linkList) {
  if(linkList) {
    return linkList.map(function(eventLink) {
      return {
        title: eventLink.label.value,
        url: eventLink.link.value
      };
    })
  } else {
    return [];
  }
}
