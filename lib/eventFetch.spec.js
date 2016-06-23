import { expect } from 'chai';
import { describe, it } from 'mocha';

import { mapAndSanitateEvent, mapEventDate, mapLinkList } from './eventFetch.js';

describe('Data sanitation', () => {
  it('should sanitate empty fields', () => {
    const event = {
      id: '123',
      data: {},
    };

    const emptyResponse = {
      id: '123',
      title: null,
      slug: null,
      strapline: null,
      featureImageFilename: null,
      internalLinks: [],
      externalLinks: [],
      datetime: null,
      body: [],
    };

    expect(mapAndSanitateEvent(event)).to.deep.equal(emptyResponse);
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

    expect(mapEventDate(s)).to.deep.equal(expectedDateTime);
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
        label: 'For full details please check out the meetup page',
        link: 'http://www.meetup.com/London-React-User-Group/',
      }]);
    });

    it('should correctly handle empty link document', () => {
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
        label: 'For full details please check out the meetup page',
        link: 'http://www.meetup.com/London-React-User-Group/',
      }, {
        label: '',
        link: '',
      },
      ]);
    });
  });
});
