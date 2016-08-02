import PrismicMock from '../../test/mocks/prismic';
import {
  fetchEvent,
  fetchAllEvents,
  fetchNewsArticle,
  fetchAllNews,
} from '.';

describe('Fetch', () => {
  let prismicMock;

  beforeEach(() => {
    prismicMock = new PrismicMock('https://rb-website-stage.prismic.io');
    prismicMock.mockApi();
  });

  describe('fetchAllEvents', () => {
    it('makes a HTTP request to the Prismic API', async () => {
      const docType = 'event';
      const scope = prismicMock.mockDocumentTypeQuery(docType);

      await fetchAllEvents();

      expect(scope.isDone()).to.equal(true);
    });
  });

  describe('fetchAllEvents', () => {
    it('makes a HTTP request to the Prismic API', async () => {
      const docType = 'news';
      const scope = prismicMock.mockDocumentTypeQuery(docType);

      await fetchAllNews();

      expect(scope.isDone()).to.equal(true);
    });
  });

  describe('fetchEvent', () => {
    it('makes a HTTP request to the Prismic API', async () => {
      const id = 'falafels';
      const scope = prismicMock.mockDocumentIdQuery(id);

      await fetchEvent(undefined, { id }, { headers: {} });

      expect(scope.isDone()).to.equal(true);
    });
  });

  describe('fetchNewsArticle', () => {
    it('should fetch an individual news article', async () => {
      const id = 'falafels';
      const scope = prismicMock.mockDocumentIdQuery(id);

      await fetchNewsArticle(undefined, { id }, { headers: {} });

      expect(scope.isDone()).to.equal(true);
    });
  });
});
