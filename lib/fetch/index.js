import Prismic from 'prismic.io';
import { PrismicConfig } from '../config/prismic.js';
import {
  sanitizeEvent,
  sanitizeNews,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
  sanitizeOrganisation,
  sanitizeTicket,
  sanitizeBadger,
  sanitizeQnA,
  sanitizeQnATopic,
  sanitizeWebinar,
  sanitizeEventsBanner,
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

async function queryPrismic(api, query, page) {
  return await api
    .form('everything')
    .ref(api.master())
    .query(query)
    .pageSize(100) // Max supported by api
    .page(page)
    .submit();
}

async function fetchAll(docType, sanitizeFunction, args) {
  const query = [Prismic.Predicates.at('document.type', docType)];
  if (args && args.tag) {
    query.push(Prismic.Predicates.at('document.tags', [args.tag]));
  }
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  let res = await queryPrismic(api, query, 1);

  const results = [...res.results];
  while (res.next_page != null) {
    res = await queryPrismic(api, query, res.page + 1);
    results.push(...res.results);
  }

  return results.map((item) => sanitizeFunction(item, docType));
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
export function fetchAllOrganisations(args) {
  return fetchAll('organisation', sanitizeOrganisation, args);
}

// TODO: Test
export function fetchOrganisation(args) {
  return fetchOne('organisation', sanitizeOrganisation, args);
}

// Tickets
export function fetchTicket(args) {
  return fetchOne('ticket', sanitizeTicket, args);
}

// Badgers
export function fetchAllBadgers() {
  return fetchAll('badger', sanitizeBadger);
}

// TODO: Test
export function fetchBadger(args) {
  return fetchOne('badger', sanitizeBadger, args);
}

export function fetchAllQnA() {
  return fetchAll('q-and-a-category', sanitizeQnA);
}

export function fetchQnATopic(args) {
  return fetchOne('q-and-a', sanitizeQnATopic, args);
}

export function fetchAllWebinars() {
  return fetchAll('webinar', sanitizeWebinar);
}

export function fetchWebinar(args) {
  return fetchOne('webinar', sanitizeWebinar, args);
}

export async function fetchEventsBanner() {
  const result = await fetchAll('events-banner', sanitizeEventsBanner);
  return result ? result[0] : null;
}
