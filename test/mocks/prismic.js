import nock from 'nock';

export default class PrismicMock {
  constructor(repo = 'https://rb-website-stage.prismic.io') {
    this.repo = repo;
  }

  mockApi() {
    return nock(this.repo, { encodedQueryParams: true })
      .get('/api')
      .reply(200, {
        refs: [
          {
            id: 'master',
            ref: 'V3UXpioAACQARLlk',
            label: 'Master',
            isMasterRef: true,
          },
          {
            id: 'V2vfLiwAAKEnvmqy',
            ref: 'V2vfRiwAABEAvmtA~V3UXpioAACQARLlk',
            label: 'Test Release',
          },
        ],
        bookmarks: {},
        types: {
          event: 'Events',
          news: 'News',
        },
        forms: {
          everything: {
            method: 'GET',
            enctype: 'application/x-www-form-urlencoded',
            action: `${this.repo}/api/documents/search`,
            fields: {
              ref: {
                type: 'String',
                multiple: false,
              },
              q: {
                type: 'String',
                multiple: true,
              },
              page: {
                type: 'Integer',
                multiple: false,
                default: '1',
              },
              pageSize: {
                type: 'Integer',
                multiple: false,
                default: '20',
              },
              after: {
                type: 'String',
                multiple: false,
              },
              fetch: {
                type: 'String',
                multiple: false,
              },
              fetchLinks: {
                type: 'String',
                multiple: false,
              },
            },
          },
        },
      });
  }

  mockDocumentTypeQuery(docType) {
    return nock(this.repo)
      .get('/api/documents/search')
      .query({
        page: 1,
        pageSize: 100,
        ref: 'V3UXpioAACQARLlk',
        q: `[[:d = at(document.type, "${docType}")]]`,
      })
      .reply(200, '{"results": []}');
  }

  mockDocumentIdQuery(docId) {
    return nock(this.repo)
      .get('/api/documents/search')
      .query({
        page: 1,
        pageSize: 20,
        ref: 'V3UXpioAACQARLlk',
        q: `[[:d = at(document.id, "${docId}")]]`,
      })
      .reply(200, '{"results": []}');
  }
}
