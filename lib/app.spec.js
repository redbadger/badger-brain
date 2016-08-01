import request from 'supertest';
import app from './app';

describe('GET /__health__', () => {
  it('returns 200, to be checked by load balancer', () =>
    request(app)
      .get('/__health__')
      .expect(200)
  );
});

describe('GET /graphql', () => {
  it('returns the GraphiQL interface if html is requested', () =>
    request(app)
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200)
      .expect(res => {
        expect(res.text).to.include('GraphiQL');
      })
  );
});
