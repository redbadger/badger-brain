/* eslint-disable no-console, max-len */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { graphql } from 'graphql';
import { Schema } from './schema';

describe('Schema', () => {
  it('should have the correct query fields', async () => {
    const query = `{
      __schema {
        queryType {
          fields {
            name
          }
        }
      }
    }`;

    const result = await graphql(Schema, query);
    // eslint-disable-next-line no-underscore-dangle
    const fields = result.data.__schema.queryType.fields.map(field => field.name);

    expect(fields).to.include('event');
    expect(fields).to.include('allEvents');
    expect(fields).to.include('news');
    expect(fields).to.include('allNews');
    expect(fields).to.include('docsTaggedWith');
  });
});
