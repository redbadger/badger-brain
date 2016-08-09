import * as prismicEventResponse from
  '../../test/fixtures/event-prismic-response.json';
import deepFreeze from 'deep-freeze';
import {
  sanitizeEvent,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
  reformatLinkList,
} from './sanitize';

describe('data/sanitize', () => {
  describe('sanitizeEvent', () => {
    it('should sanitate empty fields', () => {
      const event = {
        id: '123',
        data: {},
      };

      const emptyResponse = deepFreeze({
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
        ticketsAvailable: false,
        waitingListOpen: false,
        body: [],
        talks: [],
        schedule: [],
        sponsors: [],
        location: {
          address: null,
          coordinates: {
            latitude: null,
            longitude: null,
          },
        },
      });

      expect(sanitizeEvent(event)).to.deep.equal(emptyResponse);
    });


    it('should copy start datetime to end datetime when end datetime is empty', () => {
      const response = sanitizeEvent(prismicEventResponse);

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

  describe('reformatLinks', () => {
    it('returns an array of formatted objects', () => {
      const initialList = [
        { label: { value: 'foo' }, link: { value: 'bar.com' }, type: { value: 'STREAM' } },
      ];
      const expectedNewList = [
        { title: { value: 'foo' }, url: { value: 'bar.com' }, type: { value: 'STREAM' } },
      ];

      expect(reformatLinkList(initialList)).to.deep.equal(expectedNewList);
    });

    it('no type property defaults type to OTHER', () => {
      const initialList = [
        { label: { value: 'foo' }, link: { value: 'bar.com' } },
      ];
      const expectedNewList = [
        { title: { value: 'foo' }, url: { value: 'bar.com' }, type: { value: 'OTHER' } },
      ];

      expect(reformatLinkList(initialList)).to.deep.equal(expectedNewList);
    });
  });
});