import { expect } from 'chai';
import { describe, it } from 'mocha';
import { EventSchema } from './eventSchema.js';
import { graphql } from 'graphql';


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
