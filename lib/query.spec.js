import { expect } from 'chai';
import { describe, it } from 'mocha';
import { graphql } from 'graphql';

import injectr from 'injectr';
import { transform } from 'babel-core';

injectr.onload = (filename, content) =>
  transform(content, {
    filename
  }).code;


const mockEventFetch = {
  EventFetch: function() {
    console.log('Mock fetching event');
    return
        {
          id: '123'
          slug: 'Awesome event'
          title: 'Title of the event'
          // strapline:
          // body:
          // datetime:
          // internalLinks:
          // externalLinks:
          // featureImageFilename:
        };
  },
  AllEventsFetch: function() {
    console.log('Mock fetching all events');
    return [
        {
          title: 'Event 1'
        },
        {
          title: 'Event 2'
        }
      ];
  }
}

let EventSchema = injectr('./eventSchema.js', {
  './eventFetch.js': mockEventFetch
});


describe('Schema', () => {
  it('should be able to get event by id', async () => {
    const query = `
      query {
        allEvents {
          title
        }
      }
    `;

    const result = await graphql(EventSchema.EventSchema, query);
    console.log(JSON.stringify(result));
  });
});

xdescribe('Events Query Tests', () => {
  it('correctly returns event by its id', async () => {
    const query = `
      query EventQuery {
        event {
          title
        }
      }
    `;
    const expected = {
      event: {
        title: 'Test event'
      }
    };
    const result = await graphql(EventSchema, query);
    expect(result).to.deep.equal({ data: expected });
  });
});
