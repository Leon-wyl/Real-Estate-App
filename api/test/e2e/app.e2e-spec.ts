import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}));

describe('App (e2e)', () => {
  let app: INestApplication;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let validCookie: string[];

  const mockPrisma = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    post: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    savedPost: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    chat: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    message: {
      create: vi.fn(),
    },
  };

  beforeAll(async () => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    process.env.JWT_SECRET_KEY = 'test-secret';

    // Sign a real JWT so passport-jwt can verify it natively
    const realToken = jwt.sign({ id: 'user-1', isAdmin: false }, 'test-secret', { expiresIn: '7d' });
    validCookie = [`token=${realToken}`];

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.getHttpAdapter().get('/', (_req: any, res: any) => {
      res.status(200).json({ message: 'Real Estate API is running!' });
    });
    await app.init();
  });

  afterAll(async () => {
    consoleLogSpy.mockRestore();
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET_KEY = 'test-secret';
    mockPrisma.user.create.mockResolvedValue({ id: 'user-1' });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      username: 'alice',
      password: 'hashed-password',
      email: 'alice@test.com',
    });
  });

  describe('Health Check', () => {
    it('GET / returns API health message', async () => {
      const res = await request(app.getHttpServer()).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Real Estate API is running!' });
    });
  });

  describe('Auth Routes', () => {
    it('POST /api/auth/register — registers a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ username: 'alice', email: 'alice@test.com', password: 'secret' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'User created successfully' });
    });

    it('POST /api/auth/register — fails with bad input', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ username: 'alice' });

      expect(res.status).toBe(400);
    });

    it('POST /api/auth/register — returns 409 for duplicate user', async () => {
      const p2002Error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
        code: 'P2002',
        clientVersion: '5.13.0',
      });
      mockPrisma.user.create.mockRejectedValueOnce(p2002Error);

      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ username: 'alice', email: 'alice@test.com', password: 'secret' });

      expect(res.status).toBe(409);
    });

    it('POST /api/auth/login — sets token cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'alice', password: 'secret' });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('POST /api/auth/login — rejects missing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'noone', password: 'secret' });

      expect(res.status).toBe(401);
    });

    it('POST /api/auth/login — rejects invalid password', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1', username: 'alice', password: 'hashed',
      });
      const bcrypt = await import('bcrypt');
      (bcrypt.compare as any).mockResolvedValueOnce(false);

      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'alice', password: 'bad' });

      expect(res.status).toBe(401);
    });

    it('POST /api/auth/logout — clears cookie', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/logout');

      expect(res.status).toBe(200);
    });
  });

  describe('Post Routes', () => {
    it('GET /api/posts — lists posts with filters', async () => {
      const posts = [{ id: 'post-1', title: 'Home' }];
      mockPrisma.post.findMany.mockResolvedValueOnce(posts);

      const res = await request(app.getHttpServer())
        .get('/api/posts?city=Melbourne&type=rent&property=house&bedroom=2&minPrice=100&maxPrice=500');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(posts);
    });

    it('GET /api/posts/:id — returns post without saved (unauthenticated)', async () => {
      mockPrisma.post.findUnique.mockResolvedValueOnce({ id: 'post-1', title: 'Home' });

      const res = await request(app.getHttpServer())
        .get('/api/posts/post-1');

      expect(res.status).toBe(200);
      expect(res.body.isSaved).toBe(false);
    });

    it('GET /api/posts/:id — returns saved state (authenticated)', async () => {
      mockPrisma.post.findUnique.mockResolvedValueOnce({ id: 'post-1', title: 'Home' });
      mockPrisma.savedPost.findUnique.mockResolvedValueOnce({ id: 'saved-1' });

      const res = await request(app.getHttpServer())
        .get('/api/posts/post-1')
        .set('Cookie', validCookie);

      expect(res.status).toBe(200);
      expect(res.body.isSaved).toBe(true);
    });

    it('GET /api/posts/:id — returns 404 for missing post', async () => {
      mockPrisma.post.findUnique.mockResolvedValueOnce(null);

      const res = await request(app.getHttpServer())
        .get('/api/posts/missing');

      expect(res.status).toBe(404);
    });

    it('POST /api/posts — rejects without token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/posts')
        .send({});

      expect(res.status).toBe(401);
    });

    it('POST /api/posts — creates a post', async () => {
      const post = { id: 'post-1', title: 'Home' };
      mockPrisma.post.create.mockResolvedValueOnce(post);

      const res = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Cookie', validCookie)
        .send({
          postData: {
            title: 'Home', price: 100, images: [], address: 'addr', city: 'city',
            bedroom: 2, bathroom: 1, latitude: '1', longitude: '1',
            type: 'rent', property: 'house',
          },
          postDetail: { desc: 'Nice' },
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(post);
    });

    it('PUT /api/posts/:id — rejects without token', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/posts/post-1')
        .send({});

      expect(res.status).toBe(401);
    });

    it('PUT /api/posts/:id — updates post (owner)', async () => {
      const updated = { id: 'post-1', title: 'Updated' };
      mockPrisma.post.findUnique.mockResolvedValueOnce({ id: 'post-1', userId: 'user-1' });
      mockPrisma.post.update.mockResolvedValueOnce(updated);

      const res = await request(app.getHttpServer())
        .put('/api/posts/post-1')
        .set('Cookie', validCookie)
        .send({ title: 'Updated' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it('PUT /api/posts/:id — rejects non-owner', async () => {
      mockPrisma.post.findUnique.mockResolvedValueOnce({ id: 'post-1', userId: 'other-user' });

      const res = await request(app.getHttpServer())
        .put('/api/posts/post-1')
        .set('Cookie', validCookie)
        .send({ title: 'Hack' });

      expect(res.status).toBe(403);
    });

    it('DELETE /api/posts/:id — rejects without token', async () => {
      const res = await request(app.getHttpServer()).delete('/api/posts/post-1');
      expect(res.status).toBe(401);
    });

    it('DELETE /api/posts/:id — deletes own post', async () => {
      mockPrisma.post.findUnique.mockResolvedValueOnce({ id: 'post-1', userId: 'user-1' });
      mockPrisma.post.delete.mockResolvedValueOnce({ id: 'post-1' });

      const res = await request(app.getHttpServer())
        .delete('/api/posts/post-1')
        .set('Cookie', validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Post deleted successfully!' });
    });
  });

  describe('User Routes', () => {
    it('GET /api/users — lists users without passwords', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 'user-1', username: 'alice', email: 'alice@test.com', password: 'secret' },
      ]);

      const res = await request(app.getHttpServer()).get('/api/users');

      expect(res.status).toBe(200);
      expect(res.body[0]).not.toHaveProperty('password');
      expect(res.body[0].username).toBe('alice');
    });

    it('GET /api/users/:id — returns a user without password', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1', username: 'alice', email: 'alice@test.com', password: 'secret',
      });

      const res = await request(app.getHttpServer()).get('/api/users/user-1');

      expect(res.status).toBe(200);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body.username).toBe('alice');
    });

    it('PUT /api/users/:id — rejects without token', async () => {
      const res = await request(app.getHttpServer()).put('/api/users/user-1').send({});
      expect(res.status).toBe(401);
    });

    it('PUT /api/users/:id — rejects non-owner', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/users/other-user')
        .set('Cookie', validCookie)
        .send({ username: 'Alice' });

      expect(res.status).toBe(403);
    });

    it('PUT /api/users/:id — updates own user', async () => {
      mockPrisma.user.update.mockResolvedValueOnce({ id: 'user-1', username: 'Alice', password: 'hashed' });

      const res = await request(app.getHttpServer())
        .put('/api/users/user-1')
        .set('Cookie', validCookie)
        .send({ username: 'Alice' });

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('Alice');
    });

    it('DELETE /api/users/:id — rejects non-owner', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/users/other-user')
        .set('Cookie', validCookie);

      expect(res.status).toBe(403);
    });

    it('POST /api/users/save — toggles save post', async () => {
      mockPrisma.savedPost.findUnique.mockResolvedValueOnce(null);
      mockPrisma.savedPost.create.mockResolvedValueOnce({ id: 'saved-1' });

      const res = await request(app.getHttpServer())
        .post('/api/users/save')
        .set('Cookie', validCookie)
        .send({ postId: 'post-1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Post saved successfully!' });
    });

    it('POST /api/users/save — returns 409 on race condition', async () => {
      const p2002Error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
        code: 'P2002',
        clientVersion: '5.13.0',
      });
      mockPrisma.savedPost.findUnique.mockResolvedValueOnce(null);
      mockPrisma.savedPost.create.mockRejectedValueOnce(p2002Error);

      const res = await request(app.getHttpServer())
        .post('/api/users/save')
        .set('Cookie', validCookie)
        .send({ postId: 'post-1' });

      expect(res.status).toBe(409);
    });

    it('GET /api/users/notification — returns count', async () => {
      mockPrisma.chat.count.mockResolvedValueOnce(2);

      const res = await request(app.getHttpServer())
        .get('/api/users/notification')
        .set('Cookie', validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 2 });
    });
  });

  describe('Chat Routes', () => {
    it('GET /api/chats — rejects without token', async () => {
      const res = await request(app.getHttpServer()).get('/api/chats');
      expect(res.status).toBe(401);
    });

    it('GET /api/chats — lists chats', async () => {
      const chats = [{ id: 'chat-1', userIDs: ['user-1', 'user-2'] }];
      mockPrisma.chat.findMany.mockResolvedValueOnce(chats);

      const res = await request(app.getHttpServer())
        .get('/api/chats')
        .set('Cookie', validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(chats);
    });

    it('GET /api/chats/:id — returns chat', async () => {
      mockPrisma.chat.findUnique.mockResolvedValueOnce({
        id: 'chat-1', userIDs: ['user-1', 'user-2'], messages: [],
      });

      const res = await request(app.getHttpServer())
        .get('/api/chats/chat-1')
        .set('Cookie', validCookie);

      expect(res.status).toBe(200);
    });

    it('POST /api/chats — creates chat', async () => {
      mockPrisma.chat.findFirst.mockResolvedValueOnce(null);
      mockPrisma.chat.create.mockResolvedValueOnce({ id: 'chat-1', userIDs: ['user-1', 'user-2'] });

      const res = await request(app.getHttpServer())
        .post('/api/chats')
        .set('Cookie', validCookie)
        .send({ receiverId: 'user-2' });

      expect(res.status).toBe(200);
    });

    it('POST /api/chats — rejects without receiverId', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/chats')
        .set('Cookie', validCookie)
        .send({});

      expect(res.status).toBe(400);
    });

    it('PUT /api/chats/read/:id — marks as read', async () => {
      mockPrisma.chat.findUnique.mockResolvedValueOnce({
        id: 'chat-1', userIDs: ['user-1', 'user-2'], seenBy: [],
      });
      mockPrisma.chat.update.mockResolvedValueOnce({ id: 'chat-1', seenBy: ['user-1'] });

      const res = await request(app.getHttpServer())
        .put('/api/chats/read/chat-1')
        .set('Cookie', validCookie);

      expect(res.status).toBe(200);
    });
  });

  describe('Message Routes', () => {
    it('POST /api/messages/:chatId — rejects without token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/messages/chat-1')
        .send({ text: 'hello' });

      expect(res.status).toBe(401);
    });

    it('POST /api/messages/:chatId — sends message', async () => {
      mockPrisma.chat.findUnique.mockResolvedValueOnce({
        id: 'chat-1', userIDs: ['user-1', 'user-2'],
      });
      mockPrisma.message.create.mockResolvedValueOnce({
        id: 'msg-1', text: 'hello', userId: 'user-1', chatId: 'chat-1',
      });
      mockPrisma.chat.update.mockResolvedValueOnce({});

      const res = await request(app.getHttpServer())
        .post('/api/messages/chat-1')
        .set('Cookie', validCookie)
        .send({ text: 'hello' });

      expect(res.status).toBe(200);
    });

    it('POST /api/messages/:chatId — rejects empty text', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/messages/chat-1')
        .set('Cookie', validCookie)
        .send({ text: '' });

      expect(res.status).toBe(400);
    });
  });

  describe('Test Routes', () => {
    it('GET /api/test/should-be-logged-in — rejects without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/test/should-be-logged-in');

      expect(res.status).toBe(401);
    });

    it('GET /api/test/should-be-logged-in — succeeds with token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/test/should-be-logged-in')
        .set('Cookie', validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'You are authenticated' });
    });

    it('GET /api/test/should-be-admin — returns 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/test/should-be-admin');

      expect(res.status).toBe(401);
    });

    it('GET /api/test/should-be-admin — returns 403 when not admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/test/should-be-admin')
        .set('Cookie', validCookie);

      expect(res.status).toBe(403);
    });
  });
});
