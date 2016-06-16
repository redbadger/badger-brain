import { expect } from 'chai';
import { describe, it } from 'mocha';

import { mapAndSanitateEvent } from './eventFetch.js';

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
});
