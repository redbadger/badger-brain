import request from 'supertest';
import app from '.';

// describe('GET /__health__', () => {
//   it('returns 200, to be checked by load balancer', done => {
//     request(app)
//       .get('/__health__')
//       .expect(200)
//       .end(done);
//   });
// });

describe('GET /', () => {
  it('redirects to /graphql', done => {
    request(app)
      .get('/')
      .expect(302)
      .expect('LOCATION', '/graphql')
      .end(done);
  });
});

// describe('GET /graphql', () => {
//   it('renders OK', done => {
//     request(app)
//       .get('/graphql')
//       .expect(200)
//       .end(done);
//   });
// });
