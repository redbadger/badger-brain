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

