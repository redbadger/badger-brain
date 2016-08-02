import Prismic from 'prismic.io';
import { PrismicConfig } from '../config/prismic.js';
import {
  sanitizeEventAndNews,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
} from './sanitize';

async function fetchOne(docType, sanitizeFunction, args) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api
  .form('everything')
  .ref(api.master())
  .query(Prismic.Predicates.at('document.id', args.id)
  )
  .submit();

  if (res && res.results.length > 0) {
    return sanitizeFunction(res.results[0], docType);
  }

  return {};
}

async function fetchAll(docType, sanitizeFunction, args) {
  const query = [Prismic.Predicates.at('document.type', docType)];
  if (args && args.tag) {
    query.push(Prismic.Predicates.at('document.tags', [args.tag]));
  }

  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api
  .form('everything')
  .ref(api.master())
  .query(query)
  .pageSize(100) // TODO: implement pagination
  .submit();

  if (res && res.results.length > 0) {
    return res.results.map((item) => sanitizeFunction(item, docType));
  }
  return [];
}

/* Community */
export function fetchAllCommunities() {
  return fetchAll('community', sanitizeCommunity);
}

export function fetchCommunity(source, args) {
  return fetchOne('event', sanitizeCommunity, args);
}

/* Speaker */
export function fetchAllSpeakers() {
  return fetchAll('speaker', sanitizeSpeaker);
}

export function fetchSpeaker(source, args) {
  return fetchOne('speaker', sanitizeSpeaker, args);
}

/* Event */
export function fetchAllEvents(source, args) {
  return fetchAll('event', sanitizeEventAndNews, args);
}

export function fetchEvent(source, args) {
  return fetchOne('event', sanitizeEventAndNews, args);
}

/* News */
export function fetchAllNews(source, args) {
  return fetchAll('news', sanitizeEventAndNews, args);
}

export function fetchNewsArticle(source, args) {
  return fetchOne('news', sanitizeEventAndNews, args);
}

/* Talks */
export function fetchAllTalks() {
  return fetchAll('talk', sanitizeTalk);
}

export function fetchTalk(source, args) {
  return fetchOne('talk', sanitizeTalk, args);
}
