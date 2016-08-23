import * as prismicEventResponse from
  '../../test/fixtures/event-prismic-response.json';
import deepFreeze from 'deep-freeze';
import {
  sanitizeEvent,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
  reformatLinkList,
  sanitizePartner,
} from './sanitize';

describe('data/sanitize', () => {
  describe('sanitizeEvent', () => {
    it('should sanitate empty fields', () => {
      const event = deepFreeze({
        id: '123',
        data: {},
      });

      const emptyResponse = {
        id: '123',
        tags: [],
        title: null,
        slug: null,
        eventType: null,
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
        partners: [],
        sponsors: [],
        location: {
          address: null,
          coordinates: {
            latitude: null,
            longitude: null,
          },
        },
      };

      expect(sanitizeEvent(event)).to.deep.equal(emptyResponse);
    });

    it('should extract real values', () => {
      const event = deepFreeze({
        id: '123',
        slug: 'some-event',
        tags: ['tag1', 'tag2'],
        data: {
          'event.title': { value: 'Event Title' },
          'event.eventType': { value: 'Meetup' },
          'event.strapline': { value: 'A strapline!' },
          'event.event-image': { value: 'foo.png' },
          'event.body': { value: ['body'] },
          'event.ticketsAvailable': { value: 'ticketsAvailable' },
          'event.waitingListOpen': { value: 'waitingListOpen' },
          'event.address': { value: 'an address' },
          'event.sponsors': { value: ['event', 'sponsor'] },
          'event.schedule': { value: ['event', 'schedule'] },
          'event.talks': { value: ['event', 'talks'] },
          'event.partners': { value: ['partner1', 'partner2'] },
        },
      });

      const emptyResponse = {
        id: '123',
        tags: ['tag1', 'tag2'],
        title: 'Event Title',
        slug: 'some-event',
        eventType: 'Meetup',
        strapline: 'A strapline!',
        featureImageFilename: 'foo.png',
        internalLinks: [],
        externalLinks: [],
        datetime: null,
        startDateTime: null,
        endDateTime: null,
        ticketReleaseDate: null,
        ticketsAvailable: 'ticketsAvailable',
        waitingListOpen: 'waitingListOpen',
        body: ['body'],
        talks: ['event', 'talks'],
        schedule: ['event', 'schedule'],
        partners: ['partner1', 'partner2'],
        sponsors: ['event', 'sponsor'],
        location: {
          address: 'an address',
          coordinates: {
            latitude: null,
            longitude: null,
          },
        },
      };

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

  describe('sanitizePartner', () => {
    it('converts the raw json provied by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'exampleId',
        data: {
          'partner.name': { value: 'exampleName' },
          'partner.description': { value: 'exampleDescription' },
          'partner.partnerURL': { value: 'examplePartnerURL' },
          'partner.imageURL': { value: 'exampleImageURL' },
          'partner.jobs': { value: ['job1', 'job2'] },
        },
      };
      const result = sanitizePartner(rawData);
      expect(result).to.deep.equal({
        id: 'exampleId',
        name: 'exampleName',
        description: 'exampleDescription',
        partnerURL: 'examplePartnerURL',
        imageURL: 'exampleImageURL',
        jobs: ['job1', 'job2'],
      });
    });

    it('returns the default values if the fields are not passed from prismisc', () => {
      const rawData = {
        id: null,
        data: {},
      };
      const result = sanitizePartner(rawData);
      expect(result).to.deep.equal({
        id: null,
        name: null,
        description: null,
        partnerURL: null,
        imageURL: null,
        jobs: [],
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
