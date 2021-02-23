const backupPrismic = require('./');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

function okPromise(fn) {
  return new Promise(resolve => resolve(fn()));
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
        next_page: 'https://r.cdn.prismic.io/api/documents/search?ref=-master-ref-&page=2&pageSize=100',
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
        prev_page: 'https://r.cdn.prismic.io/api/documents/search?ref=-master-ref-&page=1&pageSize=100',
        results: [
          'we have results 2',
        ],
      },
    ];
    const apiResponse = {
      refs: [
        {
          id: 'master',
          ref: '-master-ref-',
          label: 'Master',
          isMasterRef: true,
        },
        {
          id: '-release-id-',
          ref: '-release-ref-',
          label: 'Test Release',
        },
      ],
    };
    const responsesCopy = Object.assign({}, responses);
    const saved = [];
    const getJson = (url) => okPromise(() => {
      if (url === 'https://rb-website.cdn.prismic.io/api') {
        return apiResponse;
      }
      expect(url).to.include('-master-ref-');
      return responses.shift();
    });

    const saveJson = (bucketName, name, data) => okPromise(() => {
      saved.push({ bucketName, name, data });
    });
    const funcs = { getJson, saveJson };
    backupPrismic('bucketNameForTesting', funcs)
      .then(() => {
        expect(saved.length).to.equal(3, 'Expected 3 items to have been saved to S3');

        expect(saved[0].name).to.match(/....-..-..-prismic-backup\/page-001.json/);
        expect(saved[1].name).to.match(/....-..-..-prismic-backup\/page-002.json/);
        expect(saved[2].name).to.match(/....-..-..-prismic-backup\/metadata.json/);

        expect(saved[0].bucketName).to.equal('bucketNameForTesting');
        expect(saved[1].bucketName).to.equal('bucketNameForTesting');
        expect(saved[2].bucketName).to.equal('bucketNameForTesting');

        expect(saved[0].data).to.deep.equal(responsesCopy[0]);
        expect(saved[1].data).to.deep.equal(responsesCopy[1]);

        const metadata = saved[2].data;
        expect(metadata.totalDocuments).to.equal(132);
        expect(metadata.seenDocuments).to.equal(2);
        expect(metadata.totalPages).to.equal(2);
        expect(metadata.date).to.match(/....-..-../);

        done();
      })
      .catch(done);
  });
});
