const backupPrismic = require('./');

import { expect } from 'chai';
import { describe, it } from 'mocha';

function okPromise(fn) {
  return new Promise(resolve => resolve(fn()));
}

function failPromise(fn) {
  return new Promise((resolve, reject) => reject(fn()));
}

describe('backupPrismic', () => {
  it('it saves all pages and metadata', (done) => {
    const responses = [
      {
        page: 1,
        results_per_page: 100,
        results_size: 100,
        total_results_size: 132,
        total_pages: 2,
        next_page: 'https://r.prismic.io/api/documents/search?ref=V80&page=2&pageSize=100',
        prev_page: null,
        results: [
          'we have results 1',
        ],
      },
      {
        page: 2,
        results_per_page: 100,
        results_size: 32,
        total_results_size: 132,
        total_pages: 2,
        next_page: null,
        prev_page: 'https://r.prismic.io/api/documents/search?ref=V80&page=1&pageSize=100',
        results: [
          'we have results 2',
        ],
      },
    ];
    const responsesCopy = Object.assign({}, responses);
    const saved = [];
    const getJson = () => okPromise(() => responses.shift());
    const saveJson = (name, data) => okPromise(() => {
      saved.push({ name, data });
    });
    const funcs = { getJson, saveJson };
    backupPrismic(funcs)
      .then(() => {
        expect(saved.length).to.equal(2);
        expect(saved[0].name).to.match(/prismic-data-....-..-..-page-001.json/);
        expect(saved[1].name).to.match(/prismic-data-....-..-..-page-002.json/);
        expect(saved[0].data).to.deep.equal(responsesCopy[0]);
        expect(saved[1].data).to.deep.equal(responsesCopy[1]);
        // TODO: test for metadata saving
        done();
      })
      .catch(done);
  });

  it('handles error in fetching prismic api', (done) => {
    const getJson = () => failPromise(() => 'Network error');
    const saveJson = () => {
      throw new Error('saveJson called');
    };
    const funcs = { getJson, saveJson };
    backupPrismic(funcs)
      .then(() => {
        // TODO: test error reporting
        done();
      })
      .catch(done);
  });

  it.only('handles error in saving', (done) => {
    const response = {
      page: 1,
      results_per_page: 100,
      results_size: 100,
      total_results_size: 132,
      total_pages: 2,
      next_page: null,
      prev_page: null,
      results: [
        'we have results 1',
      ],
    };
    const getJson = () => okPromise(() => response);
    const saveJson = () => failPromise(() => 'error saving');
    const funcs = { getJson, saveJson };
    backupPrismic(funcs)
      .then(() => {
        // TODO: test error reporting
        done();
      })
      .catch(done);
  });
});
