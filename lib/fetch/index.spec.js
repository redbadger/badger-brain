import PrismicMock from '../../test/mocks/prismic';
import {
  fetchEvent,
  fetchAllEvents,
  fetchNews,
} from '.';

describe('Fetch', () => {
  let prismicMock;

  beforeEach(() => {
    prismicMock = new PrismicMock('https://rb-website-stage.cdn.prismic.io');
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

  describe('fetchEvent', () => {
    it('makes a HTTP request to the Prismic API', async () => {
      const id = 'falafels';
      const scope = prismicMock.mockDocumentIdQuery(id);

      await fetchEvent({ id });

      expect(scope.isDone()).to.equal(true);
    });
  });

  describe('fetchNews', () => {
    it('makes a HTTP request to the Prismic API', async () => {
      const id = 'falafels';
      const scope = prismicMock.mockDocumentIdQuery(id);

      await fetchNews({ id });

      expect(scope.isDone()).to.equal(true);
    });
  });
});
