import nock from 'nock';

const queryify = (object) => {
  return Object.keys(object).reduce((pairs, key) => (
    pairs.concat(`${key}=${object[key]}`)
  ), []).join('&');
};

export default class PrismicMock {
  constructor(repo = 'https://rb-website-stage.prismic.io') {
    this.repo = repo;

    nock.emitter.on('no match', (req) => {
      // eslint-disable-next-line no-console
      console.error('Nock no match for URL request', req);
    });
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
            isMasterRef: true
          },
          {
            id: 'V2vfLiwAAKEnvmqy',
            ref: 'V2vfRiwAABEAvmtA~V3UXpioAACQARLlk',
            label: 'Test Release'
          }
        ],
        bookmarks: {},
        types: {
          event: 'Events',
          news: 'News'
        },
        forms: {
          everything: {
            method: 'GET',
            enctype: 'application/x-www-form-urlencoded',
            action: `${this.repo}/api/documents/search`,
            fields: {
              ref: {
                type: 'String',
                multiple: false
              },
              q: {
                type: 'String',
                multiple: true
              },
              page: {
                type: 'Integer',
                multiple: false,
                default: '1'
              },
              pageSize: {
                type: 'Integer',
                multiple: false,
                default: '20'
              },
              after: {
                type: 'String',
                multiple: false
              },
              fetch: {
                type: 'String',
                multiple: false
              },
              fetchLinks: {
                type: 'String',
                multiple: false
              }
            }
          }
        }
      });
  }

  mockDocumentTypeQuery(docType) {
    const queries = queryify({
      page: '1',
      pageSize: '100',
      ref: 'V3UXpioAACQARLlk',
      fetch: `${docType}.it%20works!`,
      q: `%5B%5B%3Ad%20%3D%20at(document.type%2C%20%22${docType}%22)%5D%5D`,
    });

    return nock(this.repo)
      .get(`/api/documents/search?${queries}`)
      .reply(200, '{"results": []}');
  }

  mockDocumentIdQuery(docId, docType) {
    const queries = queryify({
      page: '1',
      pageSize: '20',
      ref: 'V3UXpioAACQARLlk',
      fetch: `${docType}.it%20works!`,
      q: `%5B%5B%3Ad%20%3D%20at(document.id%2C%20%22${docId}%22)%5D%5D`,
    });

    return nock(this.repo)
      .get(`/api/documents/search?${queries}`)
      .reply(200, '{"results": []}')
  }
}
