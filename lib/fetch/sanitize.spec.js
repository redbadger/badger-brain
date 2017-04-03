import * as prismicEventResponse from
  '../../test/fixtures/event-prismic-response.json';

import deepFreeze from 'deep-freeze';
import {
  sanitizeEvent,
  sanitizeCommunity,
  sanitizeSpeaker,
  sanitizeTalk,
  reformatLinkList,
  sanitizeOrganisation,
  sanitizeTicket,
  sanitizeBadger,
} from './sanitize';

import { imageAssetsEndpoint, defaultEventImage } from '../config';

describe.only('data/sanitize', () => {
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
        calendarURL: null,
        slug: null,
        eventType: null,
        strapline: null,
        featuredEventDescription: null,
        featureImageFilename: `${imageAssetsEndpoint}${defaultEventImage}`,
        internalLinks: [],
        externalLinks: [],
        datetime: null,
        startDateTime: null,
        endDateTime: null,
        ticketReleaseDate: null,
        tickets: [],
        body: [],
        talks: [],
        schedule: [],
        partners: [],
        ticketLink: null,
        streamingLink: null,
        status: null,
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
          'event.calendarURL': { value: 'Event Calendar URL' },
          'event.eventType': { value: 'Meetup' },
          'event.strapline': { value: 'A strapline!' },
          'event.featuredEventDescription': { value: 'some description' },
          'event.event-image': { value: 'foo.png' },
          'event.body': { value: ['body'] },
          'event.tickets': { value: ['ticketType1', 'ticketType2'] },
          'event.address': { value: 'an address' },
          'event.sponsors': { value: ['event', 'sponsor'] },
          'event.schedule': { value: ['event', 'schedule'] },
          'event.ticketLink': { value: 'ticketLinkExample' },
          'event.streamingLink': { value: 'streamingLinkExample' },
          'event.status': { value: 'WAITLIST' },
          'event.talks': { value: ['event', 'talks'] },
          'event.partners': { value: ['partner1', 'partner2'] },
        },
      });

      const emptyResponse = {
        id: '123',
        tags: ['tag1', 'tag2'],
        title: 'Event Title',
        calendarURL: 'Event Calendar URL',
        slug: 'some-event',
        eventType: 'Meetup',
        strapline: 'A strapline!',
        featuredEventDescription: 'some description',
        featureImageFilename: `${imageAssetsEndpoint}foo.png`,
        internalLinks: [],
        externalLinks: [],
        datetime: null,
        startDateTime: null,
        endDateTime: null,
        ticketLink: 'ticketLinkExample',
        streamingLink: 'streamingLinkExample',
        status: 'WAITLIST',
        ticketReleaseDate: null,
        tickets: ['ticketType1', 'ticketType2'],
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

    it('should preserve full URL of the event image', () => {
      const event = deepFreeze({
        id: '123',
        data: {
          'event.event-image': { value: 'https://example.com/foo.png' },
        },
      });
      const result = sanitizeEvent(event);
      expect(result.featureImageFilename).to.equal('https://example.com/foo.png');
    });

    it('should convert http URL of the event image into https', () => {
      const event = deepFreeze({
        id: '123',
        data: {
          'event.event-image': { value: 'http://example.com/foo.png' },
        },
      });
      const result = sanitizeEvent(event);
      expect(result.featureImageFilename).to.equal('https://example.com/foo.png');
    });

    it('should append URL of the featured image if no full URL is available', () => {
      const event = deepFreeze({
        id: '123',
        data: {
          'event.event-image': { value: 'foo.png' },
        },
      });
      const result = sanitizeEvent(event);
      expect(result.featureImageFilename).to.equal(`${imageAssetsEndpoint}foo.png`);
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
          'speaker.profile-image': { value: { main: { url: 'https://face.gif' } } },
          'speaker.imageURL': { value: 'hhh' },
          'speaker.bio': { value: ['body'] },
        },
      };
      const result = sanitizeSpeaker(rawData);
      expect(result).to.deep.equal({
        name: 'aaa',
        company: 'bbb',
        twitterHandle: 'eee',
        githubHandle: 'fff',
        blogURL: 'ggg',
        imageURL: 'https://face.gif',
        id: 'exampleId',
        bio: ['body'],
      });
    });
  });

  describe('sanitizeOrganisation', () => {
    it('converts the raw json provied by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'exampleId',
        data: {
          'organisation.name': { value: 'exampleName' },
          'organisation.description': { value: 'exampleDescription' },
          'organisation.careerBrief': { value: 'exampleCareerBrief' },
          'organisation.URL': { value: 'exampleURL' },
          'organisation.imageURL': { value: 'exampleImageURL' },
          'organisation.jobs': { value: ['job1', 'job2'] },
        },
      };
      const result = sanitizeOrganisation(rawData);
      expect(result).to.deep.equal({
        id: 'exampleId',
        name: 'exampleName',
        description: 'exampleDescription',
        careerBrief: 'exampleCareerBrief',
        url: 'exampleURL',
        imageURL: 'exampleImageURL',
        jobs: ['job1', 'job2'],
      });
    });

    it('returns the default values if the fields are not passed from prismisc', () => {
      const rawData = {
        id: null,
        data: {},
      };
      const result = sanitizeOrganisation(rawData);
      expect(result).to.deep.equal({
        id: null,
        name: null,
        description: null,
        careerBrief: null,
        url: null,
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

  describe('sanitizeBadger', () => {
    const baseBadger = {
      slug: undefined,
      firstName: null,
      lastName: null,
      order: null,
      jobTitle: null,
      primaryImageUrl: null,
      secondaryImageUrl: null,
      startDate: null,
      about: null,
      skills: null,
      influence: null,
      achievements: null,
      linkedin: null,
      github: null,
      twitter: null,
      squarespaceId: null,
      categories: [],
    };

    it('converts the raw json provied by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'badgerId',
        uid: 'alex-savin',
        data: {
          'badger.name': { value: 'Alex Savin' },
          'badger.order': { value: 1 },
          'badger.job-title': { value: 'Technical Lead' },
          'badger.primary-image': { value: { main: { url: 'https://face.gif' } } },
          'badger.secondary-image': { value: { main: { url: 'https://another-face.gif' } } },
          'badger.image-url': { value: 'https://face.gif' },
          'badger.secondary-image-url': { value: 'https://another-face.gif' },
          'badger.start-date': { value: '05-12-2016' },
          'badger.about': { value: 'I like CSS' },
          'badger.skills': { value: 'Programming, JavaScript' },
          'badger.influence': { value: 'My mum' },
          'badger.achievements': { value: 'Cycle to work' },
          'badger.linkedin': { value: { url: 'http://linkedin.com' } },
          'badger.github': { value: { url: 'http://github.com' } },
          'badger.twitter': { value: { url: 'http://twitter.com' } },
          'badger.squarespace-author-id': { value: 'chs73ls0' },
        },
        tags: [
          'Engineering',
          'Leadership',
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        id: 'badgerId',
        slug: 'alex-savin',
        firstName: 'Alex',
        lastName: 'Savin',
        order: 1,
        jobTitle: 'Technical Lead',
        primaryImageUrl: 'https://face.gif',
        secondaryImageUrl: 'https://another-face.gif',
        startDate: '05-12-2016',
        about: 'I like CSS',
        skills: 'Programming, JavaScript',
        influence: 'My mum',
        achievements: 'Cycle to work',
        linkedin: 'http://linkedin.com',
        github: 'http://github.com',
        twitter: 'http://twitter.com',
        squarespaceId: 'chs73ls0',
        categories: [
          { name: 'Engineering', order: 5, slug: 'engineering' },
          { name: 'Leadership', order: 1, slug: 'leadership' },
        ],
      });
    });

    it('converts valid tags into categories', () => {
      const rawData = {
        id: 'badgerId',
        data: {
        },
        tags: [
          'Leadership',
          'Strategy',
          'PM',
          'Engineering',
          'QA',
          'Operations',
          'Marketing',
          'Adorable',
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        categories: [
          { name: 'Leadership', order: 1, slug: 'leadership' },
          { name: 'Strategy', order: 2, slug: 'strategy' },
          { name: 'PM', order: 3, slug: 'pm' },
          { name: 'Engineering', order: 5, slug: 'engineering' },
          { name: 'QA', order: 6, slug: 'qa' },
          { name: 'Operations', order: 7, slug: 'operations' },
          { name: 'Marketing', order: 8, slug: 'marketing' },
          { name: 'Adorable', order: 9, slug: 'adorable' },
        ],
      });
    });

    it('skips invalid tags', () => {
      const rawData = {
        id: 'badgerId',
        data: {
        },
        tags: [
          'Leadership1',
          'Stdrategy',
          'xPM',
          'yyy',
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
      });
    });

    it('converts valid tags into categories and skips invalid ones', () => {
      const rawData = {
        id: 'badgerId',
        data: {
        },
        tags: [
          'Leadership1',
          'Strategy',
          'xPM',
          'QA',
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        categories: [
          { name: 'Strategy', order: 2, slug: 'strategy' },
          { name: 'QA', order: 6, slug: 'qa' },
        ],
      });
    });

    it('converts empty name into null first name and surname', () => {
      const rawData = {
        id: 'badgerId',
        data: {
        },
        tags: [
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        firstName: null,
        lastName: null,
      });
    });

    it('converts triple name into two in first name and one in surname', () => {
      const rawData = {
        id: 'badgerId',
        data: {
          'badger.name': { value: 'Alex Nikolaievich Savin' },
        },
        tags: [
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        firstName: 'Alex Nikolaievich',
        lastName: 'Savin',
      });
    });

    it('converts double barrel first name into first name and surname', () => {
      const rawData = {
        id: 'badgerId',
        data: {
          'badger.name': { value: 'Alex-Nikolaievich Savin' },
        },
        tags: [
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        firstName: 'Alex-Nikolaievich',
        lastName: 'Savin',
      });
    });

    it('converts double barrel last name into first name and surname', () => {
      const rawData = {
        id: 'badgerId',
        data: {
          'badger.name': { value: 'Alex Nikolaievich-Savin' },
        },
        tags: [
        ],
      };
      const result = sanitizeBadger(rawData);
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        firstName: 'Alex',
        lastName: 'Nikolaievich-Savin',
      });
    });
  });

  describe('sanitizeTicket', () => {
    it('converts the raw json provied by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'exampleId',
        data: {
          'ticket.title': { value: 'exampleTitle' },
          'ticket.releaseDate': { value: '2016-07-27T13:00:00+0000' },
          'ticket.price': { value: 'examplePrice' },
          'ticket.available': { value: true },
        },
      };
      const result = sanitizeTicket(rawData);
      expect(result).to.deep.equal({
        id: 'exampleId',
        title: 'exampleTitle',
        releaseDate: {
          date: '27',
          iso: '2016-07-27T13:00:00+0000',
          month: '07',
          monthSym: 'July',
          year: '2016',
        },
        price: 'examplePrice',
        available: true,
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
