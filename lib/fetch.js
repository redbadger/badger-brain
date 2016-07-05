import Prismic from 'prismic.io';
import { PrismicConfig } from './config/prismic.js';

function valueOrDefault(data, type, name, defaultValue) {
  const property = data[`${type}.${name}`];
  return property ? property.value : defaultValue;
}

export function sanitate(item, type) {
  const imageField = (type === 'news') ? 'featureImage' : 'event-image';
  const getFieldValue = valueOrDefault.bind(null, item.data, type);

  return {
    id: item.id,
    slug: item.slug ? item.slug : null,
    tags: item.tags || [],
    title: getFieldValue('title', null),
    strapline: getFieldValue('strapline', null),
    datetime: getFieldValue('timestamp', null),
    startDateTime: getFieldValue('timestamp', null),
    endDateTime: getFieldValue('timestampEnd', null),
    internalLinks: getFieldValue('internalLinks', []),
    externalLinks: getFieldValue('externalLinks', []),
    body: getFieldValue('body', []),
    featureImageFilename: getFieldValue(imageField, null),
  };
}

async function fetchOne(_, args, req, docType) {
  const ref = req.headers['x-preview'];

  const api = await Prismic.api(PrismicConfig.apiEndpoint);
  const res = await api.form('everything').ref(ref || api.master()).query(
    Prismic.Predicates.at('document.id', args.id))
    .submit();

  if (res && res.results.length > 0) {
    return sanitate(res.results[0], docType);
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
    const mappedList = res.results.map((item) => sanitate(item, docType));
    return mappedList;
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
