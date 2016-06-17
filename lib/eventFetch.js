import Prismic from 'prismic.io';
import dateFns from 'date-fns';
import { PrismicConfig } from './config/prismic.js';

function mapEventDate(timestamp) {
  const d = new Date(timestamp);
  return {
    iso: timestamp,
    date: dateFns.format(d, 'DD'),
    month: dateFns.format(d, 'MM'),
    monthSym: dateFns.format(d, 'MMM'),
    year: dateFns.getYear(d),
  };
}

function mapLinkList(linkList) {
  if (linkList) {
    return linkList.map((eventLink) => (
      {
        title: eventLink.label.value,
        url: eventLink.link.value,
      })
    );
  }
  return [];
}

export function mapAndSanitateEvent(event) {
  return {
    id: event.id,
    slug: event.slug ? event.slug : null,
    title: event.data['event.title'] ?
      event.data['event.title'].value : null,
    strapline: event.data['event.strapline'] ?
      event.data['event.strapline'].value : null,
    datetime: event.data['event.timestamp'] ?
      mapEventDate(event.data['event.timestamp'].value) : null,
    internalLinks: event.data['event.internalLinks'] ?
      mapLinkList(event.data['event.internalLinks'].value) : [],
    externalLinks: event.data['event.externalLinks'] ?
      mapLinkList(event.data['event.externalLinks'].value) : [],
    body: event.data['event.body'] ?
      event.data['event.body'].value : [],
    featureImageFilename: event.data['event.event-image'] ?
      event.data['event.event-image'].value : null,
  };
}

export async function EventFetch(_, args) {
  const r = await Prismic.api(PrismicConfig.apiEndpoint).then((api) =>
    api.form('everything').ref(api.master()).query(
      Prismic.Predicates.at('document.id', args.id))
    .submit()
  ).then(
    (response) => response,
    (err) => console.log('ERR', err) // eslint-disable-line no-console
  );

  if (r.results.length > 0) {
    return mapAndSanitateEvent(r.results[0]);
  }

  return {};
}

export async function AllEventsFetch() {
  const r = await Prismic.api(PrismicConfig.apiEndpoint).then((api) =>
      api.form('everything').ref(api.master()).query(Prismic
        .Predicates.at('document.type', 'event'))
        .pageSize(100) // TODO: implement pagination
        .submit())
    .then((response) => response,
      (err) => console.log('ERR', err)); // eslint-disable-line no-console

  if (r.results.length > 0) {
    const mappedList = r.results.map((event) => mapAndSanitateEvent(event));
    return mappedList;
  }

  return {};
}
