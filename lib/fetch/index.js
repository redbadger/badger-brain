import Prismic from 'prismic.io';
import { PrismicConfig } from '../config/prismic.js';
import {
  sanitizeEvent,
  sanitizeNews,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
  sanitizePartner,
} from './sanitize';

async function fetchOne(docType, sanitizeFunction, args) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api
    .form('everything')
    .ref(api.master())
    .query(Prismic.Predicates.at('document.id', args.id))
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

// Community
export function fetchAllCommunities() {
  return fetchAll('community', sanitizeCommunity);
}

// TODO: Test
export function fetchCommunity(args) {
  return fetchOne('event', sanitizeCommunity, args);
}

// Speaker
export function fetchAllSpeakers() {
  return fetchAll('speaker', sanitizeSpeaker);
}

// TODO: Test
export function fetchSpeaker(args) {
  return fetchOne('speaker', sanitizeSpeaker, args);
}

// Event
export function fetchAllEvents(source, args) {
  return fetchAll('event', sanitizeEvent, args);
}

export function fetchEvent(args) {
  return fetchOne('event', sanitizeEvent, args);
}

// News
export function fetchAllNews(source, args) {
  return fetchAll('news', sanitizeNews, args);
}

export function fetchNews(args) {
  return fetchOne('news', sanitizeNews, args);
}

// Talks
export function fetchAllTalks() {
  return fetchAll('talk', sanitizeTalk);
}

// TODO: Test
export function fetchTalk(args) {
  return fetchOne('talk', sanitizeTalk, args);
}

// TODO: Test? lol
export function fetchAllPartners(args) {
  return fetchAll('partner', sanitizePartner, args);
}

// TODO: Test
export function fetchPartner(args) {
  return fetchOne('partner', sanitizePartner, args);
}
