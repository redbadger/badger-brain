import Prismic from 'prismic.io';
import dateFns from 'date-fns';
import { PrismicConfig } from './config/prismic.js';

export function mapEventDate(timestamp) {
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
    return linkList.map((newsLink) => {
      const linkItem = {};
      if (!newsLink.hasOwnProperty('label') || !newsLink.hasOwnProperty('link')) {
        return undefined;
      }
      linkItem.title = (newsLink.label && newsLink.label.hasOwnProperty('value')) ?
        newsLink.label.value : '';
      linkItem.url = (newsLink.link && newsLink.link.hasOwnProperty('value')) ?
        newsLink.link.value : '';
      return linkItem;
    }).filter(l => l !== undefined);
  }

  return [];
}

export function mapAndSanitateNews(news) {
  return {
    id: news.id,
    slug: news.slug ? news.slug : null,
    tags: news.tags || [],
    title: news.data['news.title'] ?
      news.data['news.title'].value : null,
    strapline: news.data['news.strapline'] ?
      news.data['news.strapline'].value : null,
    datetime: news.data['news.timestamp'] ?
      mapEventDate(news.data['news.timestamp'].value) : null,
    internalLinks: news.data['news.internalLinks'] ?
      mapLinkList(news.data['news.internalLinks'].value) : [],
    externalLinks: news.data['news.externalLinks'] ?
      mapLinkList(news.data['news.externalLinks'].value) : [],
    body: news.data['news.body'] ?
      news.data['news.body'].value : [],
    featureImageFilename: news.data['news.news-image'] ?
      news.data['news.news-image'].value : null,
  };
}

export async function NewsFetch(_, args, req) {
  const ref = req.headers['x-preview'];

  const r = await Prismic.api(PrismicConfig.apiEndpoint).then((api) =>
    api.form('everything').ref(ref || api.master()).query(
      Prismic.Predicates.at('document.id', args.id))
    .submit()
  ).then(
    (response) => response,
    (err) => console.log('ERR', err) // eslint-disable-line no-console
  );

  if (r.results.length > 0) {
    return mapAndSanitateNews(r.results[0]);
  }

  return {};
}

export async function AllNewsFetch() {
  const r = await Prismic.api(PrismicConfig.apiEndpoint).then((api) =>
      api.form('everything').ref(api.master()).query(Prismic
        .Predicates.at('document.type', 'news'))
        .pageSize(100) // TODO: implement pagination
        .submit())
    .then((response) => response,
      (err) => console.log('ERR', err)); // eslint-disable-line no-console

  if (r.results.length > 0) {
    const mappedList = r.results.map((news) => mapAndSanitateNews(news));
    return mappedList;
  }

  return {};
}
