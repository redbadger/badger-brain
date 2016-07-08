import Prismic from 'prismic.io';
import dateFns from 'date-fns';
import { PrismicConfig } from './config/prismic.js';
import _ from 'lodash';

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

export function sanitizeEventAndNews(item, type) {
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
    talks: _.get(item, "data.['event.talks'].value", []),
  };
}

export function sanitizeTalk(json) {
  return {
    id: json.id,
    title: _.get(json, "data.['talk.title'].value", null),
    summary: _.get(json, "data.['talk.summary'].value", null),
    speakers: _.get(json, "data.['talk.speakers'].value", []),
  };
}

export function sanitizeCommunity(json) {
  return {
    id: json.id,
    title: _.get(json, "data.['community.title'].value", null),
    summary: _.get(json, "data.['community.summary'].value", null),
    mailingListTitle: _.get(json, "data.['community.mailingListTitle'].value", null),
    events: _.get(json, "data.['community.events'].value", []),
  };
}

export function sanitizeSpeaker(json) {
  return {
    id: json.id,
    name: _.get(json, "data.['speaker.name'].value", null),
    company: _.get(json, "data.['speaker.company'].value", null),
    twitterHandle: _.get(json, "data.['speaker.twitterHandle'].value", null),
    githubHandle: _.get(json, "data.['speaker.githubHandle'].value", null),
    blogURL: _.get(json, "data.['speaker.blogURL'].value", null),
    imageURL: _.get(json, "data.['speaker.imageURL'].value", null),
  };
}

async function fetchOne(source, args, req, docType, sanitizeFunction) {
  // const ref = req.headers['x-preview'];

  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(api.master()).query(
    Prismic.Predicates.at('document.id', args.id)
  )
  .submit();

  if (res && res.results.length > 0) {
    return sanitizeFunction(res.results[0], docType);
  }

  return {};
}

async function fetchAll(docType, sanitizeFunction) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(api.master()).query(
    Prismic.Predicates.at('document.type', docType)
  )
  .pageSize(100)
  .submit();

  if (res && res.results.length > 0) {
    return res.results.map((item) => sanitizeFunction(item, docType));
  }
  return [];
}

export async function getDocumentById(id, type, sanitizeFunction) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(api.master()).query(
    Prismic.Predicates.at('document.id', id)
  )
  .submit();

  if (res && res.results.length > 0) {
    return sanitizeFunction(res.results[0], type);
  }

  return {};
}

/* Community */
export async function fetchAllCommunities() {
  return fetchAll('community', sanitizeCommunity);
}

export async function fetchCommunity(source, args, req) {
  return fetchOne(source, args, req, 'event', sanitizeCommunity);
}

/* Speaker */
export async function fetchAllSpeakers() {
  return fetchAll('speaker', sanitizeSpeaker);
}

export async function fetchSpeaker(source, args, req) {
  return fetchOne(source, args, req, 'speaker', sanitizeSpeaker);
}

/* Event */
export async function fetchAllEvents() {
  return fetchAll('event', sanitizeEventAndNews);
}

export async function fetchEvent(source, args, req) {
  return fetchOne(source, args, req, 'event', sanitizeEventAndNews);
}

/* News */
export async function fetchAllNews() {
  return fetchAll('news', sanitizeEventAndNews);
}

export async function fetchNewsArticle(source, args, req) {
  return fetchOne(source, args, req, 'news', sanitizeEventAndNews);
}

/* Talks */
export async function fetchAllTalks() {
  return fetchAll('talk', sanitizeTalk);
}

export async function fetchTalk(source, args, req) {
  return fetchOne(source, args, req, 'talk', sanitizeTalk);
}
