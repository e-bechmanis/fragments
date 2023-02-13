// tests/unit/getById.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // User should not be able to get access to fragments without appropriate credentials
  test('cannot get fragment data if user does not have appropriate credentials', () =>
    request(app)
      .get('/v1/fragments/4dcc65b6-9d57-453a-bd3a-63c107a51698')
      .auth('random@email.com', 'password1')
      .expect(401));

  //only authenticated users can access fragments
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/4dcc65b6-9d57-453a-bd3a-63c107a51698').expect(401));

  test('return fragment by id', async () => {
    const data = Buffer.from('hello');
    const postReq = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const fragmentUrl = `/v1/fragments/${postReq.body.fragment.id}`;
    const res = await request(app).get(fragmentUrl).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/plain');
  });

  test('trying to access nonexistent fragment will return 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/4dcc65b6-9d57-453a-bd3a-63c107a51698')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
