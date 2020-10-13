require('dotenv').config();

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    beforeAll((done) => {
      client.connect();
      return done();
    });

    afterAll((done) => {
      return client.end(done);
    });

    test('returns campaigns', async () => {
      const data = await fakeRequest(app)
        .get('/campaigns')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expect.any(Array));
    });
  });
});
