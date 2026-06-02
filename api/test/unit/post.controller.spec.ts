import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostController } from '../../src/post/post.controller';
import { PostService } from '../../src/post/post.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('PostController', () => {
  let controller: PostController;

  const mockPrisma = {} as any;
  const mockJwtService = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('lists posts with filters', async () => {
      const posts = [{ id: 'post-1', title: 'Home' }];
      (mockPrisma as any).post = { findMany: vi.fn().mockResolvedValue(posts) };

      const result = await controller.findAll({ city: 'Melbourne', type: 'rent', property: 'house', bedroom: 2, minPrice: 100, maxPrice: 500 } as any);

      expect(result).toEqual(posts);
    });

    it('handles errors', async () => {
      (mockPrisma as any).post = { findMany: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.findAll({})).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('returns post without saved state when unauthenticated', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockResolvedValue({ id: 'post-1', title: 'Home' }) };

      const result = await controller.findOne('post-1', undefined);

      expect(result).toEqual({ id: 'post-1', title: 'Home', isSaved: false });
    });

    it('returns saved=true when saved post exists', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockResolvedValue({ id: 'post-1', title: 'Home' }) };
      (mockPrisma as any).savedPost = { findUnique: vi.fn().mockResolvedValue({ id: 'saved-1' }) };

      const result = await controller.findOne('post-1', 'user-1');

      expect(result).toEqual({ id: 'post-1', title: 'Home', isSaved: true });
    });

    it('returns 404 for missing post', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockResolvedValue(null) };

      await expect(controller.findOne('missing', undefined)).rejects.toThrow(NotFoundException);
    });

    it('handles errors', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.findOne('post-1', undefined)).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('creates a post for authenticated user', async () => {
      const post = { id: 'post-1', title: 'Home' };
      (mockPrisma as any).post = { create: vi.fn().mockResolvedValue(post) };

      const dto = { postData: { title: 'Home', price: 100, images: [], address: 'addr', city: 'city', bedroom: 2, bathroom: 1, latitude: '1', longitude: '1', type: 'rent', property: 'house' }, postDetail: { desc: 'Nice' } } as any;

      const result = await controller.create(dto, 'user-1');

      expect(result).toEqual(post);
    });

    it('handles errors', async () => {
      (mockPrisma as any).post = { create: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.create({ postData: {}, postDetail: {} } as any, 'user-1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('updates post for owner', async () => {
      const updated = { id: 'post-1', title: 'Updated Home' };
      (mockPrisma as any).post = {
        findUnique: vi.fn().mockResolvedValue({ id: 'post-1', userId: 'user-1' }),
        update: vi.fn().mockResolvedValue(updated),
      };

      const result = await controller.update('post-1', { title: 'Updated Home' }, 'user-1');

      expect(result).toEqual(updated);
    });

    it('rejects non-owner', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockResolvedValue({ id: 'post-1', userId: 'other-user' }) };

      await expect(
        controller.update('post-1', { title: 'Hack' }, 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns 404 for missing post', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockResolvedValue(null) };

      await expect(
        controller.update('missing', { title: 'Hack' }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('handles errors', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.update('post-1', {}, 'user-1')).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('deletes own post', async () => {
      (mockPrisma as any).post = {
        findUnique: vi.fn().mockResolvedValue({ id: 'post-1', userId: 'user-1' }),
        delete: vi.fn().mockResolvedValue({ id: 'post-1' }),
      };

      const result = await controller.remove('post-1', 'user-1');

      expect(result).toEqual({ message: 'Post deleted successfully!' });
    });

    it('returns 404 for missing post', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockResolvedValue(null) };

      await expect(controller.remove('post-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('returns 403 for non-owner', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockResolvedValue({ id: 'post-1', userId: 'other-user' }) };

      await expect(controller.remove('post-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('handles errors', async () => {
      (mockPrisma as any).post = { findUnique: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.remove('post-1', 'user-1')).rejects.toThrow();
    });
  });
});
