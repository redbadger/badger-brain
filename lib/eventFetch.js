import Prismic from 'prismic.io';
import dateFns from 'date-fns';
import { PrismicConfig } from './config/prismic.js';

export function mapEventDate(timestamp) {
  const d = new Date(timestamp);
  return {
    iso: timestamp,
    date: dateFns.format(d, 'DD'),
    month: dateFns.format(d, 'MM'),
    monthSym: dateFns.format(d, 'MMM'),
    year: dateFns.format(d, 'YYYY'),
  };
}

export function mapLinkList(linkList) {
  if (linkList) {
    return linkList.map((eventLink) => {
      const linkItem = {};
      if (!eventLink.hasOwnProperty('label') || !eventLink.hasOwnProperty('link')) {
        return undefined;
      }
      linkItem.title = (eventLink.label && eventLink.label.hasOwnProperty('value')) ?
        eventLink.label.value : '';
      linkItem.url = (eventLink.link && eventLink.link.hasOwnProperty('value')) ?
        eventLink.link.value : '';
      return linkItem;
    }).filter(l => l !== undefined);
  }

  return [];
}

export function mapAndSanitate(item, type) {
  const imageField = (type === 'news') ? 'featureImage' : 'event-image'

  return {
    id: item.id,
    slug: item.slug ? item.slug : null,
    tags: item.tags || [],
    title: item.data[type + '.title'] ?
      item.data[type + '.title'].value : null,
    strapline: item.data[type + '.strapline'] ?
      item.data[type + '.strapline'].value : null,
    datetime: item.data[type + '.timestamp'] ?
      mapEventDate(item.data[type + '.timestamp'].value) : null,
    internalLinks: item.data[type + '.internalLinks'] ?
      mapLinkList(item.data[type + '.internalLinks'].value) : [],
    externalLinks: item.data[type + '.externalLinks'] ?
      mapLinkList(item.data[type + '.externalLinks'].value) : [],
    body: item.data[type + '.body'] ?
      item.data[type + '.body'].value : [],
    featureImageFilename: item.data[type + '.' + imageField] ?
      item.data[type + '.' + imageField].value : null,
  };
}

export async function EventFetch(_, args, req) {
  const ref = req.headers['x-preview'];
  const docType = (this && this.docType) ? this.docType : 'event';

  const res = await Prismic.api(PrismicConfig.apiEndpoint).then((api) =>
    api.form('everything').ref(ref || api.master()).query(
      Prismic.Predicates.at('document.id', args.id))
    .submit()
  ).then(
    (response) => response,
    (err) => console.log('ERR', err) // eslint-disable-line no-console
  );

  if (res && res.results.length > 0) {
    return mapAndSanitate(res.results[0], docType);
  }

  return {};
}

export async function AllEventsFetch() {
  const docType = (this && this.docType) ? this.docType : 'event';

  const res = await Prismic.api(PrismicConfig.apiEndpoint).then((api) =>
      api.form('everything').ref(api.master()).query(Prismic
        .Predicates.at('document.type', docType))
        .pageSize(100) // TODO: implement pagination
        .submit())
    .then((response) => response,
      (err) => console.log('ERR', err)); // eslint-disable-line no-console

  if (res && res.results.length > 0) {
    const mappedList = res.results.map((event) => mapAndSanitate(event, docType));
    return mappedList;
  }

  return {};
}
