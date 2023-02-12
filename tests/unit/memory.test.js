const memory = require('../../src/model/data/memory');

/* readFragment
writeFragment
readFragmentData,
writeFragmentData */

describe('memory read/write check', () => {
  test('should return Promise', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
