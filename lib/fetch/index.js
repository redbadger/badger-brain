import Prismic from 'prismic.io';
import fetch from 'node-fetch';
import { PrismicConfig } from '../config/prismic.js';
import { HubspotConfig } from '../config/hubspot.js';
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
  sanitizeBlogPosts,
} from './sanitize';

async function fetchAllBlogAuthors() {
  const response = await fetch(HubspotConfig.blogAuthorsApiEndPoint);
  const result = await response.json();
  return result.objects.map(author => author.slug);
}

// PRISMIC
async function fetchOne(docType, sanitizeFunction, args) {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api
    .form('everything')
    .ref(api.master())
    .query(Prismic.Predicates.at('document.id', args.id))
    .submit();

  const options = { docType };
  if (docType === 'badger') {
    options.blogAuthors = await fetchAllBlogAuthors();
  }

  if (res && res.results.length > 0) {
    return sanitizeFunction(res.results[0], options);
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
  const options = { docType };
  if (docType === 'badger') {
    options.blogAuthors = await fetchAllBlogAuthors();
  }

  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  let res = await queryPrismic(api, query, 1);

  const results = [...res.results];
  while (res.next_page != null) {
    res = await queryPrismic(api, query, res.page + 1);
    results.push(...res.results);
  }

  return results.map(item => sanitizeFunction(item, options));
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

export function fetchEventsBanner() {
  return fetchAll('event-banner', sanitizeEventsBanner);
}

function constructHubspotQueryString(args) {
  let query = HubspotConfig.blogApiEndpoint;
  const keys = Object.keys(args);
  if (keys.length) {
    keys.forEach(key => {
      query += `&${key === 'blogAuthorId' ? 'blog_author_id' : key}=${
        args[key]
      }`;
    });
  }
  return query;
}

async function fetchAllHubspot(sanitizeFunction, args) {
  // There is a fetch wrapper for hubspot: https://github.com/MadKudu/node-hubspot
  // but it currently does not have support for blogs
  const response = await fetch(constructHubspotQueryString(args));
  const results = await response.json();

  return results.objects.map(item => sanitizeFunction(item));
}

async function fetchOneHubspot(sanitizeFunction, args) {
  const response = await fetch(
    constructHubspotQueryString({ ...args, limit: 1 })
  );
  const results = await response.json();

  return sanitizeFunction(results.objects[0]);
}

export function fetchAllBlogPosts(args) {
  return fetchAllHubspot(sanitizeBlogPosts, args);
}

export function fetchBlogPost(args) {
  return fetchOneHubspot(sanitizeBlogPosts, args);
}
