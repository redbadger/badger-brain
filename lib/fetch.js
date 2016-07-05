import Prismic from 'prismic.io';
import dateFns from 'date-fns';
import { PrismicConfig } from './config/prismic.js';

export function mapDate(timestamp) {
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
    return linkList.map((link) => {
      const linkItem = {};
      if (!link.hasOwnProperty('label') || !link.hasOwnProperty('link')) {
        return undefined;
      }
      linkItem.title = (link.label && link.label.hasOwnProperty('value')) ?
        link.label.value : '';
      linkItem.url = (link.link && link.link.hasOwnProperty('value')) ?
        link.link.value : '';
      return linkItem;
    }).filter(l => l !== undefined);
  }

  return [];
}

export function mapAndSanitate(item, type) {
  const imageField = (type === 'news') ? 'featureImage' : 'event-image';
  return {
    id: item.id,
    slug: item.slug ? item.slug : null,
    tags: item.tags || [],
    title: item.data[`${type}.title`] ?
      item.data[`${type}.title`].value : null,
    strapline: item.data[`${type}.strapline`] ?
      item.data[`${type}.strapline`].value : null,
    datetime: item.data[`${type}.timestamp`] ?
      mapDate(item.data[`${type}.timestamp`].value) : null,
    internalLinks: item.data[`${type}.internalLinks`] ?
      mapLinkList(item.data[`${type}.internalLinks`].value) : [],
    externalLinks: item.data[`${type}.externalLinks`] ?
      mapLinkList(item.data[`${type}.externalLinks`].value) : [],
    body: item.data[`${type}.body`] ?
      item.data[`${type}.body`].value : [],
    featureImageFilename: item.data[`${type}.${imageField}`] ?
      item.data[`${type}.${imageField}`].value : null,
  };
}

export function sanitize(key, type, defaultValue, json) {
  const datum = json.data[`${type}.${key}`];
  return datum ? datum.value : defaultValue;
}

export function sanitizeCommunity(json) {
  return {
    communitySummary: sanitize('communitySummary', 'community', null, json),
    mailingListTitle: sanitize('mailingListTitle', 'community', null, json),
    displayedEventId: sanitize('displayedEventId', 'community', null, json),
  };
}

export function sanitizeSpeaker(json) {
  return {
    name: sanitize('name', 'speaker', null, json),
    company: sanitize('company', 'speaker', null, json),
    talkTitle: sanitize('talkTitle', 'speaker', null, json),
    talkSummary: sanitize('talkSummary', 'speaker', null, json),
    twitterHandle: sanitize('twitterHandle', 'speaker', null, json),
    githubHandle: sanitize('githubHandle', 'speaker', null, json),
    blogURL: sanitize('blogURL', 'speaker', null, json),
    imageURL: sanitize('imageURL', 'speaker', null, json),
  };
}

async function fetchOne(_, args, req, docType) {
  const ref = req.headers['x-preview'];

  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(ref || api.master()).query(
    Prismic.Predicates.at('document.id', args.id))
    .submit();

  if (res && res.results.length > 0) {
    return mapAndSanitate(res.results[0], docType);
  }

  return {};
}

async function fetchAll(docType) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(api.master()).query(Prismic
    .Predicates.at('document.type', docType))
    .pageSize(100) // TODO: implement pagination
    .submit();

  if (res && res.results.length > 0) {
    const mappedList = res.results.map((item) => mapAndSanitate(item, docType));
    return mappedList;
  }
  return {};
}


export async function fetchEventById(eventId) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(api.master()).query(
    Prismic.Predicates.at('document.id', eventId))
    .submit();
  if (res && res.results.length > 0) {
    return mapAndSanitate(res.results[0], 'event');
  }
  return {};
}

export async function getSpeakersByEventId(eventId) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(api.master()).query(Prismic
    .Predicates.at('document.type', 'speaker'),
    Prismic.Predicates.fulltext('my.speaker.eventId', eventId))
    .submit();

  if (res && res.results.length > 0) {
    const mappedList = res.results.map((item) => sanitizeSpeaker(item));
    return mappedList;
  }
  return {};
}

export async function fetchCommunity() {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(api.master()).query(Prismic
    .Predicates.at('document.type', 'community'))
    .pageSize(100)
    .submit();

  if (res && res.results.length > 0) {
    return sanitizeCommunity(res.results[0]);
  }
  return {};
}

export async function fetchEvent(_, args, req) {
  return fetchOne(_, args, req, 'event');
}

export async function fetchAllEvents() {
  return fetchAll('event');
}

export async function fetchNewsArticle(_, args, req) {
  return fetchOne(_, args, req, 'news');
}

export async function fetchAllNews() {
  return fetchAll('news');
}
