import { expect } from 'chai';
import { describe, it } from 'mocha';

import { mapAndSanitateEvent, mapEventDate } from './eventFetch.js';

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
});
