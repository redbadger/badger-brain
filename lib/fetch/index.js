import Prismic from 'prismic.io';
import { PrismicConfig } from '../config/prismic.js';
import {
  sanitizeEventAndNews,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
} from './sanitize';

async function fetchOne(source, args, req, docType, sanitizeFunction) {
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
export function fetchAllCommunities() {
  return fetchAll('community', sanitizeCommunity);
}

export function fetchCommunity(source, args, req) {
  return fetchOne(source, args, req, 'event', sanitizeCommunity);
}

/* Speaker */
export function fetchAllSpeakers() {
  return fetchAll('speaker', sanitizeSpeaker);
}

export function fetchSpeaker(source, args, req) {
  return fetchOne(source, args, req, 'speaker', sanitizeSpeaker);
}

/* Event */
export function fetchAllEvents(_, args) {
  return fetchAll('event', sanitizeEventAndNews, args);
}

export function fetchEvent(source, args, req) {
  return fetchOne(source, args, req, 'event', sanitizeEventAndNews);
}

/* News */
export function fetchAllNews(_, args) {
  return fetchAll('news', sanitizeEventAndNews, args);
}

export function fetchNewsArticle(source, args, req) {
  return fetchOne(source, args, req, 'news', sanitizeEventAndNews);
}

/* Talks */
export function fetchAllTalks() {
  return fetchAll('talk', sanitizeTalk);
}

export function fetchTalk(source, args, req) {
  return fetchOne(source, args, req, 'talk', sanitizeTalk);
}
