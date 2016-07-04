import nock from 'nock';

import {
  mapAndSanitate,
  mapDate, mapLinkList,
  getDocumentsByType,
  getDocumentById,
} from './fetch';

nock.emitter.on('no match', function(req) {
  console.error('Nock no match for URL request', req);
});

describe('Fetch', () => {
  const executionContext = {
    fieldASTs: [{
      selectionSet: {
        selections: [{
          name: {
            value: 'it works!',
          },
        }],
      },
    }],
  };

  const req = {
    headers: {},
  };

  beforeEach(() => {
    nock('https://rb-website-stage.prismic.io', {"encodedQueryParams":true})
      .get('/api')
      .reply(200, {"refs":[{"id":"master","ref":"V3UXpioAACQARLlk","label":"Master","isMasterRef":true},{"id":"V2vfLiwAAKEnvmqy","ref":"V2vfRiwAABEAvmtA~V3UXpioAACQARLlk","label":"Test Release"}],"bookmarks":{},"types":{"event":"Events","news":"News"},"forms":{"everything":{"method":"GET","enctype":"application/x-www-form-urlencoded","action":"https://rb-website-stage.prismic.io/api/documents/search","fields":{"ref":{"type":"String","multiple":false},"q":{"type":"String","multiple":true},"page":{"type":"Integer","multiple":false,"default":"1"},"pageSize":{"type":"Integer","multiple":false,"default":"20"},"after":{"type":"String","multiple":false},"fetch":{"type":"String","multiple":false},"fetchLinks":{"type":"String","multiple":false}}}}});
  });

  describe('All', () => {
    it('should fetch events', async () => {
      const docType = 'event';
      const scope = nock('https://rb-website-stage.prismic.io')
        .get('/api/documents/search?page=1&pageSize=100&ref=V3UXpioAACQARLlk&fetch=event.it%20works!&q=%5B%5B%3Ad%20%3D%20at(document.type%2C%20%22event%22)%5D%5D')
        .reply(200, '{"results": []}');

      await getDocumentsByType(docType)(null, null, req, executionContext);
      expect(scope.isDone()).to.be.true;
    });

    it('should fetch news', async () => {
      const docType = 'news';
      const scope = nock('https://rb-website-stage.prismic.io')
        .get('/api/documents/search?page=1&pageSize=100&ref=V3UXpioAACQARLlk&fetch=news.it%20works!&q=%5B%5B%3Ad%20%3D%20at(document.type%2C%20%22news%22)%5D%5D')
        .reply(200, '{"results": []}');

      await getDocumentsByType(docType)(null, null, req, executionContext);

      expect(scope.isDone()).to.be.true;
    });
  });

  describe('Individual', () => {
    it('should fetch an individual event', async () => {
      const id = 'falafels';
      const scope = nock('https://rb-website-stage.prismic.io')
        .get('/api/documents/search?page=1&pageSize=20&ref=V3UXpioAACQARLlk&fetch=event.it%20works!&q=%5B%5B%3Ad%20%3D%20at(document.id%2C%20%22' + id + '%22)%5D%5D')
        .reply(200, '{"results": []}');

      const result = await getDocumentById('event')(undefined, {id: id}, req, executionContext);

      expect(scope.isDone()).to.be.true;
    });

    it('should fetch an individual news article', async () => {
      const id = 'falafels';
      const scope = nock('https://rb-website-stage.prismic.io')
        .get('/api/documents/search?page=1&pageSize=20&ref=V3UXpioAACQARLlk&fetch=news.it%20works!&q=%5B%5B%3Ad%20%3D%20at(document.id%2C%20%22' + id + '%22)%5D%5D')
        .reply(200, '{"results": []}');

      const result = await getDocumentById('news')(undefined, {id: id}, req, executionContext);

      expect(scope.isDone()).to.be.true;
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

    expect(mapAndSanitate('event', event)).to.deep.equal(emptyResponse);
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
