import http from 'http';
import assert from 'assert';

describe('Example Node Server', () => {
  it('should return 200', done => {
    http.get('http://localhost:3001/graphql', res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
