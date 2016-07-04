import { map, curry } from 'ramda';
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

export const mapAndSanitate = curry((type, item) => {
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
});

const transformResult = curry((docType, results) =>
  results.map(mapAndSanitate(docType)));

const getFieldsFromQuery = (type, fieldASTs) =>
  map(field => `${type}.${field.name.value}`, fieldASTs[0].selectionSet.selections);

const makeAPIRequest = async (query, ref, transformer) => {
  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const init = api.form('everything').ref(ref || api.master());
  const { results } = await query(init).submit();
  return transformer(results);
};

export const getDocumentsByType = type => async (_, args, req, { fieldASTs }) => {
  const fields = getFieldsFromQuery(type, fieldASTs);
  const query = api => api.fetch(fields)
    .query(Prismic.Predicates.at('document.type', type))
    .pageSize(100);
  return await makeAPIRequest(query, req.headers['x-preview'], transformResult(type));
};

export const getDocumentById = type => async (_, args, req, { fieldASTs }) => {
  const fields = getFieldsFromQuery(type, fieldASTs);
  const query = api => api.fetch(fields)
    .query(Prismic.Predicates.at('document.id', args.id));
  const results = await makeAPIRequest(query, req.headers['x-preview'], transformResult(type));
  return results[0];
};
