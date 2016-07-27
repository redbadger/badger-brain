import Prismic from 'prismic.io';
import { PrismicConfig } from './config/prismic.js';
import { pathOr } from 'ramda';

function makeGetter(json) {
  return key => pathOr(null, ['data', key, 'value'], json);
}

export function reformatLinkList(linkList) {
  if (!linkList) return [];
  return linkList.map((link) => {
    const newLink = {};
    newLink.title = link.label;
    newLink.url = link.link;
    return newLink;
  });
}

export function sanitizeEventAndNews(item, type) {
  const get = makeGetter(item);
  const imageField = (type === 'news') ? 'featureImage' : 'event-image';
  return {
    id: item.id,
    slug: item.slug || null,
    tags: item.tags || [],
    title: get(`${type}.title`),
    strapline: get(`${type}.strapline`),
    datetime: get(`${type}.timestamp`),
    startDateTime: get(`${type}.timestamp`),
    endDateTime: pathOr(get(`${type}.timestamp`),
      ['data', `${type}.timestampEnd`, 'value'], item),
    ticketReleaseDate: get(`${type}.ticketReleaseDate`),
    ticketsAvailiable: get(`${type}.ticketsAvailiable`) || false,
    eventActionLink: get(`${type}.eventActionLink`),
    internalLinks: reformatLinkList((get(`${type}.internalLinks`))),
    externalLinks: reformatLinkList((get(`${type}.externalLinks`))),
    body: get(`${type}.body`) || [],
    featureImageFilename: get(`${type}.${imageField}`),
    talks: get('event.talks') || [],
    schedule: get(`${type}.schedule`) || [],
    sponsors: get(`${type}.sponsors`) || [],
    location: {
      address: get('event.address'),
      coordinates: {
        longitude: pathOr(null, ['longitude'], get('event.location')),
        latitude: pathOr(null, ['latitude'], get('event.location')),
      },
    },
  };
}

export function sanitizeTalk(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    title: get('talk.title'),
    summary: get('talk.summary'),
    speakers: get('talk.speakers'),
  };
}

export function sanitizeCommunity(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    title: get('community.title'),
    summary: get('community.summary'),
    mailingListTitle: get('community.mailingListTitle'),
    events: get('community.events'),
    featuredEvent: get('community.featuredEvent'),
    mailingListSummary: get('community.mailingListSummary'),
  };
}

export function sanitizeSpeaker(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    name: get('speaker.name'),
    company: get('speaker.company'),
    twitterHandle: get('speaker.twitterHandle'),
    githubHandle: get('speaker.githubHandle'),
    blogURL: get('speaker.blogURL'),
    imageURL: get('speaker.imageURL'),
  };
}

async function fetchOne(source, args, req, docType, sanitizeFunction) {
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
