import { server } from '@/server'; // import your server here
import request from 'supertest';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/db');
jest.mock('@/lib/pinecone');
jest.mock('@/lib/s3');

describe('POST /api/create-chat', () => {
  it('returns 401 when unauthorized', async () => {
    auth.mockResolvedValueOnce({ userId: null });

    const response = await request(server).post('/api/create-chat');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'unauthorized' });
  });

  it('returns 200 and the correct data when the operation is successful', async () => {
    auth.mockResolvedValueOnce({ userId: 'testUserId' });
    db.insert.mockResolvedValueOnce([{ insertedId: '123' }]);
    getS3Url.mockReturnValueOnce('testS3Url');

    const response = await request(server)
      .post('/api/create-chat')
      .send({ file_key: 'testFileKey', file_name: 'testFileName' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ chat_id: '123' });
  });

  it('returns 500 when there is an internal server error', async () => {
    auth.mockResolvedValueOnce({ userId: 'testUserId' });
    db.insert.mockRejectedValueOnce(new Error('Test error'));

    const response = await request(server)
      .post('/api/create-chat')
      .send({ file_key: 'testFileKey', file_name: 'testFileName' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'internal server error' });
  });
});