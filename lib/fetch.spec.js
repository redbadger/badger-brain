import { expect } from 'chai';
import { describe, it } from 'mocha';
import PrismicMock from '../test/mocks/prismic';

import {
  mapAndSanitate,
  mapDate, mapLinkList,
  fetchEvent,
  fetchAllEvents,
  fetchNewsArticle,
  fetchAllNews,
} from './fetch';

describe('Fetch', () => {
  let prismicMock;

  beforeEach(() => {
    prismicMock = new PrismicMock('https://rb-website-stage.prismic.io');
    prismicMock.mockApi();
  });

  describe('All', () => {
    it('should fetch events', async () => {
      const docType = 'event';
      const scope = prismicMock.mockDocumentTypeQuery(docType);

      await fetchAllEvents();

      expect(scope.isDone()).to.equal(true);
    });

    it('should fetch news', async () => {
      const docType = 'news';
      const scope = prismicMock.mockDocumentTypeQuery(docType);

      await fetchAllNews();

      expect(scope.isDone()).to.equal(true);
    });
  });

  describe('Individual', () => {
    it('should fetch an individual event', async () => {
      const id = 'falafels';
      const scope = prismicMock.mockDocumentIdQuery(id);

      await fetchEvent(undefined, { id }, { headers: {} });

      expect(scope.isDone()).to.equal(true);
    });

    it('should fetch an individual news article', async () => {
      const id = 'falafels';
      const scope = prismicMock.mockDocumentIdQuery(id);

      await fetchNewsArticle(undefined, { id }, { headers: {} });

      expect(scope.isDone()).to.equal(true);
    });
  });
});

describe('Data sanitation', () => {
  it('should sanitate empty fields', () => {
    const event = {
      id: '123',
      data: {},
    };

    const emptyResponse = {
      id: '123',
      tags: [],
      title: null,
      slug: null,
      strapline: null,
      featureImageFilename: null,
      internalLinks: [],
      externalLinks: [],
      datetime: null,
      body: [],
    };

    expect(mapAndSanitate(event)).to.deep.equal(emptyResponse);
  });

  it('should create datetime object of a correct format', () => {
    const s = '2016-06-08T13:00:00+0100';
    const expectedDateTime = {
      iso: s,
      date: '08',
      month: '06',
      monthSym: 'Jun',
      year: '2016',
    };

    expect(mapDate(s)).to.deep.equal(expectedDateTime);
  });

  describe('List of links response mapping', () => {
    it('should correctly map list of links', () => {
      const linkList = [{
        label: {
          type: 'Text',
          value: 'For full details please check out the meetup page',
        },
        link: {
          type: 'Text',
          value: 'http://www.meetup.com/London-React-User-Group/',
        },
      }];
      expect(mapLinkList(linkList)).to.deep.equal([{
        title: 'For full details please check out the meetup page',
        url: 'http://www.meetup.com/London-React-User-Group/',
      }]);
    });

    it('should correctly omit empty link document', () => {
      const linkList = [{
        label: {
          type: 'Text',
          value: 'For full details please check out the meetup page',
        },
        link: {
          type: 'Text',
          value: 'http://www.meetup.com/London-React-User-Group/',
        },
      }, {}];
      expect(mapLinkList(linkList)).to.deep.equal([{
        title: 'For full details please check out the meetup page',
        url: 'http://www.meetup.com/London-React-User-Group/',
      },
      ]);
    });
  });
});
