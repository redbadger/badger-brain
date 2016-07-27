import PrismicMock from '../test/mocks/prismic';
import * as prismicEventResponse from
  '../test/fixtures/event-prismic-response.json';

import {
  sanitizeEventAndNews,
  fetchEvent,
  fetchAllEvents,
  fetchNewsArticle,
  fetchAllNews,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
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
      startDateTime: null,
      endDateTime: null,
      ticketReleaseDate: null,
      body: [],
      talks: [],
      schedule: [],
      sponsors: [],
      status: {
        enum: null,
        summary: null,
      },
      location: {
        address: null,
        coordinates: {
          latitude: null,
          longitude: null,
        },
      },
    };

    expect(sanitizeEventAndNews(event)).to.deep.equal(emptyResponse);
  });


  it('should copy start datetime to end datetime when end datetime is empty', () => {
    const response = sanitizeEventAndNews(prismicEventResponse, 'event');

    expect(response.startDateTime).to.deep.equal(response.endDateTime);
    expect(response.endDateTime).to.equal('2016-07-27T23:00:00+0000');
  });
});


describe('sanitizeCommunity', () => {
  it('converts the raw json provided by prismic to be readable by graphql', () => {
    const rawData = {
      id: 'exampleId',
      data: {
        'community.summary': { value: 'aaa' },
        'community.title': { value: 'example title' },
        'community.mailingListTitle': { value: 'bbb' },
        'community.featuredEvent': { value: 'example event' },
        'community.events': { value: [{ event: 'exampleEvent' }] },
        'community.mailingListSummary': { value: 'Example Mailing List Summary' },
      },
    };
    const result = sanitizeCommunity(rawData);
    expect(result).to.deep.equal({
      summary: 'aaa',
      mailingListTitle: 'bbb',
      id: 'exampleId',
      title: 'example title',
      featuredEvent: 'example event',
      mailingListSummary: 'Example Mailing List Summary',
      events: [
        {
          event: 'exampleEvent',
        },
      ],
    });
  });
});

describe('sanitizeSpeaker', () => {
  it('converts the raw json provied by prismic to be readable by graphql', () => {
    const rawData = {
      id: 'exampleId',
      data: {
        'speaker.name': { value: 'aaa' },
        'speaker.company': { value: 'bbb' },
        'speaker.twitterHandle': { value: 'eee' },
        'speaker.githubHandle': { value: 'fff' },
        'speaker.blogURL': { value: 'ggg' },
        'speaker.imageURL': { value: 'hhh' },
      },
    };
    const result = sanitizeSpeaker(rawData);
    expect(result).to.deep.equal({
      name: 'aaa',
      company: 'bbb',
      twitterHandle: 'eee',
      githubHandle: 'fff',
      blogURL: 'ggg',
      imageURL: 'hhh',
      id: 'exampleId',
    });
  });
});

describe('sanitizeTalk', () => {
  it('converts the raw json provied by prismic to be readable by graphql', () => {
    const rawData = {
      id: 'exampleId',
      data: {
        'talk.title': { value: 'aaa' },
        'talk.summary': { value: 'bbb' },
        'talk.speakers': { value: [{ speaker: 'exampleSpeaker' }] },
      },
    };
    const result = sanitizeTalk(rawData);
    expect(result).to.deep.equal({
      title: 'aaa',
      summary: 'bbb',
      id: 'exampleId',
      speakers: [
        {
          speaker: 'exampleSpeaker',
        },
      ],
    });
  });
});
