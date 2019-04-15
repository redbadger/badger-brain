import * as prismicEventResponse from '../../test/fixtures/event-prismic-response.json';

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
  sanitizeQnA,
  sanitizeQnATopic,
  sanitizeWebinar,
  sanitizeEventsBanner,
} from './sanitize';

import { imageAssetsEndpoint, defaultEventImage } from '../config';

describe('data/sanitize', () => {
  describe('sanitizeEvent', () => {
    const baseEvent = {
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

    it('should sanitize empty fields', () => {
      const event = deepFreeze({
        id: '123',
        data: {},
      });

      expect(sanitizeEvent(event)).to.deep.equal(baseEvent);
    });

    it('should extract real values', () => {
      const event = deepFreeze({
        id: '123',
        uid: 'event-title',
        tags: ['tag1', 'tag2'],
        data: {
          'event.title': { value: 'Event Title' },
          'event.calendarURL': { value: 'Event Calendar URL' },
          'event.eventType': { value: 'Meetup' },
          'event.strapline': { value: 'A strapline!' },
          'event.featuredEventDescription': { value: 'some description' },
          'event.featured-image': {
            value: { main: { url: 'https://foo.png' } },
          },
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
        slug: 'event-title',
        tags: ['tag1', 'tag2'],
        title: 'Event Title',
        calendarURL: 'Event Calendar URL',
        eventType: 'Meetup',
        strapline: 'A strapline!',
        featuredEventDescription: 'some description',
        featureImageFilename: 'https://foo.png',
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

    it('should fall back to the old image url if featured-image is not present', () => {
      const rawData = {
        id: '123',
        data: {
          'event.featured-image': null,
          'event.event-image': { value: 'foo.png' },
        },
      };
      const result = sanitizeEvent(rawData);
      expect(result).to.deep.equal({
        ...baseEvent,
        id: '123',
        featureImageFilename: `${imageAssetsEndpoint}foo.png`,
      });
    });

    it('should preserve full URL of the event image', () => {
      const event = deepFreeze({
        id: '123',
        data: {
          'event.event-image': { value: 'https://example.com/foo.png' },
        },
      });
      const result = sanitizeEvent(event);
      expect(result.featureImageFilename).to.equal(
        'https://example.com/foo.png'
      );
    });

    it('should convert http URL of the event image into https', () => {
      const event = deepFreeze({
        id: '123',
        data: {
          'event.event-image': { value: 'http://example.com/foo.png' },
        },
      });
      const result = sanitizeEvent(event);
      expect(result.featureImageFilename).to.equal(
        'https://example.com/foo.png'
      );
    });

    it('should append URL of the featured image if no full URL is available', () => {
      const event = deepFreeze({
        id: '123',
        data: {
          'event.event-image': { value: 'foo.png' },
        },
      });
      const result = sanitizeEvent(event);
      expect(result.featureImageFilename).to.equal(
        `${imageAssetsEndpoint}foo.png`
      );
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
          'community.mailingListSummary': {
            value: 'Example Mailing List Summary',
          },
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
    const baseSpeaker = {
      name: null,
      company: null,
      twitterHandle: null,
      githubHandle: null,
      imageURL: null,
      blogURL: null,
      id: null,
      bio: null,
    };
    it('converts the raw json provied by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'exampleId',
        data: {
          'speaker.name': { value: 'aaa' },
          'speaker.company': { value: 'bbb' },
          'speaker.twitterHandle': { value: 'eee' },
          'speaker.githubHandle': { value: 'fff' },
          'speaker.profile-image': {
            value: { main: { url: 'https://face.gif' } },
          },
          'speaker.imageURL': { value: 'hhh' },
          'speaker.blogURL': { value: 'ggg' },
          'speaker.bio': { value: ['body'] },
        },
      };
      const result = sanitizeSpeaker(rawData);
      expect(result).to.deep.equal({
        name: 'aaa',
        company: 'bbb',
        twitterHandle: 'eee',
        githubHandle: 'fff',
        imageURL: 'https://face.gif',
        blogURL: 'ggg',
        id: 'exampleId',
        bio: ['body'],
      });
    });

    it('falls back to the old image url if profile-image is not present', () => {
      const rawData = {
        id: 'exampleId',
        data: {
          'speaker.profile-image': null,
          'speaker.imageURL': { value: 'https://face.gif' },
        },
      };
      const result = sanitizeSpeaker(rawData);
      expect(result).to.deep.equal({
        ...baseSpeaker,
        id: 'exampleId',
        imageURL: 'https://face.gif',
      });
    });
  });

  describe('sanitizeOrganisation', () => {
    const baseOrganisation = {
      id: null,
      name: null,
      description: null,
      careerBrief: null,
      url: null,
      imageURL: null,
      jobs: [],
    };
    it('converts the raw json provided by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'exampleId',
        data: {
          'organisation.name': { value: 'exampleName' },
          'organisation.description': { value: 'exampleDescription' },
          'organisation.careerBrief': { value: 'exampleCareerBrief' },
          'organisation.URL': { value: 'exampleURL' },
          'organisation.organisation-image': {
            value: { main: { url: 'https://exampleImage.gif' } },
          },
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
        imageURL: 'https://exampleImage.gif',
        jobs: ['job1', 'job2'],
      });
    });

    it('returns the default values if the fields are not passed from prismic', () => {
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

    it('falls back to the old image url if organisation-image is not present', () => {
      const rawData = {
        id: 'exampleId',
        data: {
          'organisation.organisation-image': null,
          'organisation.imageURL': { value: 'exampleImageURL' },
        },
      };
      const result = sanitizeOrganisation(rawData);
      expect(result).to.deep.equal({
        ...baseOrganisation,
        id: 'exampleId',
        imageURL: 'exampleImageURL',
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
      categories: [],
      hasBlogPosts: false,
    };

    it('converts the raw json provied by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'badgerId',
        uid: 'alex-savin',
        data: {
          'badger.name': { value: 'Alex Savin' },
          'badger.order': { value: 1 },
          'badger.job-title': { value: 'Technical Lead' },
          'badger.primary-image': {
            value: { main: { url: 'https://face.gif' } },
          },
          'badger.secondary-image': {
            value: { main: { url: 'https://another-face.gif' } },
          },
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
        },
        tags: ['Engineering', 'Leadership'],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
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
        hasBlogPosts: true,
        categories: [
          { name: 'Engineering', order: 5, slug: 'engineering' },
          { name: 'Leadership', order: 1, slug: 'leadership' },
        ],
      });
    });

    it('converts valid tags into categories', () => {
      const rawData = {
        id: 'badgerId',
        data: {},
        tags: [
          'Leadership',
          'Strategy',
          'Delivery',
          'Engineering',
          'QA',
          'Operations',
          'Marketing',
          'Insights',
          'Adorable',
        ],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        categories: [
          { name: 'Leadership', order: 1, slug: 'leadership' },
          { name: 'Strategy', order: 2, slug: 'strategy' },
          { name: 'Delivery', order: 3, slug: 'delivery' },
          { name: 'Engineering', order: 5, slug: 'engineering' },
          { name: 'QA', order: 6, slug: 'qa' },
          { name: 'Operations', order: 7, slug: 'operations' },
          { name: 'Marketing', order: 8, slug: 'marketing' },
          { name: 'Insights', order: 9, slug: 'insights' },
          { name: 'Adorable', order: 10, slug: 'adorable' },
        ],
      });
    });

    it('skips invalid tags', () => {
      const rawData = {
        id: 'badgerId',
        data: {},
        tags: ['Leadership1', 'Stdrategy', 'xPM', 'yyy'],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
      });
    });

    it('converts valid tags into categories and skips invalid ones', () => {
      const rawData = {
        id: 'badgerId',
        data: {},
        tags: ['Leadership1', 'Strategy', 'xPM', 'QA'],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
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
        data: {},
        tags: [],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
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
        tags: [],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
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
        tags: [],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
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
        tags: [],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        firstName: 'Alex',
        lastName: 'Nikolaievich-Savin',
      });
    });

    it('falls back to old image urls if primary-image and secondary-image are not present', () => {
      const rawData = {
        id: 'badgerId',
        data: {
          'badger.primary-image': null,
          'badger.secondary-image': null,
          'badger.image-url': { value: 'https://face.gif' },
          'badger.secondary-image-url': { value: 'https://another-face.gif' },
        },
        tags: [],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        primaryImageUrl: 'https://face.gif',
        secondaryImageUrl: 'https://another-face.gif',
      });
    });

    it('converts http to https in image url', () => {
      const rawData = {
        id: 'badgerId',
        data: {
          'badger.image-url': { value: 'http://photo.png' },
        },
        tags: [],
      };
      const result = sanitizeBadger(rawData, { blogAuthors: ['alex-savin'] });
      expect(result).to.deep.equal({
        ...baseBadger,
        id: 'badgerId',
        primaryImageUrl: 'https://photo.png',
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

  describe('sanitizeQnA', () => {
    it('converts the raw json provided by prismic to be readable by graphql', () => {
      const rawData = {
        uid: 'projects',
        data: {
          'q-and-a-category.category-name': { value: 'Projects' },
          'q-and-a-category.q-n-a-list': { value: 'topics' },
          'q-and-a-category.order': { value: 1 },
        },
      };
      const result = sanitizeQnA(rawData);
      expect(result).to.deep.equal({
        name: 'Projects',
        slug: 'projects',
        topics: 'topics',
        order: 1,
      });
    });
  });

  describe('sanitizeQnATopic', () => {
    /* eslint-disable max-len */
    it('converts the raw json provided by Prismic to be readable by graphql', () => {
      const rawData = {
        id: 'exampleId',
        uid: 'how-much-will-my-project-cost',
        data: {
          'q-and-a.question': { value: 'How much will my project cost?' },
          'q-and-a.answer': {
            value: [
              {
                type: 'paragraph',
                text:
                  'This is totally dependent on your requirements, but Red Badger\u2019s ' +
                  'value is in the total cost of ownership, i.e we have proven time and again that we always ' +
                  'deliver and speed projects to market so total costs always end up being less than using a ' +
                  'competitor whose day-rate might be cheaper, but would take longer.',
                spans: [
                  {
                    start: 52,
                    end: 64,
                    type: 'strong',
                  },
                  {
                    start: 304,
                    end: 310,
                    type: 'hyperlink',
                    data: {
                      type: 'Link.web',
                      value: { url: 'https://red-badger.com' },
                    },
                  },
                ],
              },
              {
                type: 'paragraph',
                text:
                  'Obviously all projects are completely different, a further discussion ' +
                  'would be needed to ascertain a time-line but Red Badger are known for their speed to market.  ' +
                  'We can always advise on a rough time-scale once we\u2019ve had an initial brief and will be ' +
                  'able to forecast in more accuracy once the project is complete.',
                spans: [],
              },
            ],
          },
          'q-and-a.order': { value: 2 },
        },
      };
      const result = sanitizeQnATopic(rawData);
      expect(result).to.deep.equal({
        slug: 'how-much-will-my-project-cost',
        question: 'How much will my project cost?',
        answer:
          '<p>This is totally dependent on your requirements, but <strong>Red Badger’s</strong> value is in the total cost of ownership, i.e we have proven time and again that we always deliver and speed projects to market so total costs always end up being less than using a competitor whose day-rate might be cheaper, but would take <a href="https://red-badger.com">longer</a>.</p><p>Obviously all projects are completely different, a further discussion would be needed to ascertain a time-line but Red Badger are known for their speed to market.  We can always advise on a rough time-scale once we’ve had an initial brief and will be able to forecast in more accuracy once the project is complete.</p>',
        order: 2,
      });
    });
    /* eslint-enable max-len */
  });

  describe('reformatLinks', () => {
    it('returns an array of formatted objects', () => {
      const initialList = [
        {
          label: { value: 'foo' },
          link: { value: 'bar.com' },
          type: { value: 'STREAM' },
        },
      ];
      const expectedNewList = [
        {
          title: { value: 'foo' },
          url: { value: 'bar.com' },
          type: { value: 'STREAM' },
        },
      ];

      expect(reformatLinkList(initialList)).to.deep.equal(expectedNewList);
    });

    it('no type property defaults type to OTHER', () => {
      const initialList = [
        { label: { value: 'foo' }, link: { value: 'bar.com' } },
      ];
      const expectedNewList = [
        {
          title: { value: 'foo' },
          url: { value: 'bar.com' },
          type: { value: 'OTHER' },
        },
      ];

      expect(reformatLinkList(initialList)).to.deep.equal(expectedNewList);
    });
  });

  describe('sanitizeWebinar', () => {
    const baseWebinar = {
      id: null,
      slug: null,
      title: null,
      startDateTime: null,
      endDateTime: null,
      featureImageFilename: null,
      body: [],
      speakers: [],
      webinarKey: null,
    };
    it('converts the raw json provided by prismic to be readable by graphql', () => {
      const rawData = {
        id: 'exampleId',
        uid: 'exampleSlug',
        data: {
          'webinar.title': { value: 'aaa' },
          'webinar.timestamp': { value: '01-01-2017' },
          'webinar.timestampEnd': { value: '02-01-2017' },
          'webinar.featured-image': {
            value: { main: { url: 'https://face.gif' } },
          },
          'webinar.body': { value: ['body'] },
          'webinar.speakers': { value: ['webinar', 'speaker'] },
          'webinar.webinar-key': { value: '1234567890' },
        },
      };
      const result = sanitizeWebinar(rawData);
      expect(result).to.deep.equal({
        id: 'exampleId',
        slug: 'exampleSlug',
        title: 'aaa',
        startDateTime: '01-01-2017',
        endDateTime: '02-01-2017',
        featureImageFilename: 'https://face.gif',
        body: ['body'],
        speakers: ['webinar', 'speaker'],
        webinarKey: '1234567890',
      });
    });

    it('returns the default values if the fields are not passed from prismic', () => {
      const rawData = {
        id: null,
        uid: null,
        data: {},
      };
      const result = sanitizeWebinar(rawData);
      expect(result).to.deep.equal(baseWebinar);
    });

    it('should copy start datetime to end datetime when end datetime is empty', () => {
      const rawData = {
        id: 'exampleId',
        uid: 'exampleSlug',
        data: {
          'webinar.timestamp': { value: '01-01-2017' },
          'webinar.timestampEnd': null,
        },
      };
      const result = sanitizeWebinar(rawData);
      expect(result).to.deep.equal({
        ...baseWebinar,
        id: 'exampleId',
        slug: 'exampleSlug',
        startDateTime: '01-01-2017',
        endDateTime: '01-01-2017',
      });
    });
  });

  describe('sanitizeEventsBanner', () => {
    const baseEventsBanner = {
      url: null,
      altText: null,
      campaignName: null,
      desktopURL: null,
      tabletURL: null,
      mobileURL: null,
    };
    it('converts the raw json provided by prismic to be readable by graphql', () => {
      const rawData = {
        data: {
          'event-banner.link': { value: { url: 'http://example.com' } },
          'event-banner.alt-text': { value: [{ text: 'testtext' }] },
          'event-banner.campaign-name': { value: [{ text: 'campaign name' }] },
          'event-banner.desktopURL': {
            value: { main: { url: 'https://face.gif' } },
          },
          'event-banner.tabletURL': {
            value: { main: { url: 'https://face.gif' } },
          },
          'event-banner.mobileURL': {
            value: { main: { url: 'https://face.gif' } },
          },
        },
      };
      const result = sanitizeEventsBanner(rawData);
      expect(result).to.deep.equal({
        url: 'http://example.com',
        altText: 'testtext',
        campaignName: 'campaign name',
        desktopURL: 'https://face.gif',
        tabletURL: 'https://face.gif',
        mobileURL: 'https://face.gif',
      });
    });

    it('returns the default values if the fields are not passed from prismic', () => {
      const rawData = {
        data: {},
      };
      const result = sanitizeEventsBanner(rawData);
      expect(result).to.deep.equal(baseEventsBanner);
    });
  });
});
