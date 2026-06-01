import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}));

describe('UserController', () => {
  let controller: UserController;

  const mockPrisma = {} as any;
  const mockJwtService = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    vi.clearAllMocks();
  });

  describe('findAll / findOne', () => {
    it('returns users and a single user', async () => {
      (mockPrisma as any).user = {
        findMany: vi.fn().mockResolvedValue([{ id: 'user-1' }]),
        findUnique: vi.fn().mockResolvedValue({ id: 'user-1' }),
      };

      expect(await controller.findAll()).toEqual([{ id: 'user-1' }]);
      expect(await controller.findOne('user-1')).toEqual({ id: 'user-1' });
    });

    it('strips password from responses', async () => {
      (mockPrisma as any).user = {
        findMany: vi.fn().mockResolvedValue([{ id: 'user-1', username: 'alice', password: 'secret' }]),
        findUnique: vi.fn().mockResolvedValue({ id: 'user-1', username: 'alice', password: 'secret' }),
      };

      const users = await controller.findAll();
      expect(users[0]).not.toHaveProperty('password');
      expect(users[0]).toHaveProperty('username', 'alice');

      const user = await controller.findOne('user-1');
      expect(user).not.toHaveProperty('password');
    });

    it('returns null for missing user', async () => {
      (mockPrisma as any).user = { findUnique: vi.fn().mockResolvedValue(null) };

      expect(await controller.findOne('user-1')).toBeNull();
    });

    it('handles errors', async () => {
      (mockPrisma as any).user = { findMany: vi.fn().mockRejectedValue(new Error('db error')) };
      await expect(controller.findAll()).rejects.toThrow();

      (mockPrisma as any).user = { findUnique: vi.fn().mockRejectedValue(new Error('db error')) };
      await expect(controller.findOne('user-1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('rejects non-owner', async () => {
      await expect(
        controller.update('other-user', {}, 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('updates own user', async () => {
      (mockPrisma as any).user = {
        update: vi.fn().mockResolvedValue({ id: 'user-1', username: 'Alice', password: 'hashed-password' }),
      };

      const result = await controller.update('user-1', { username: 'Alice', password: 'secret' }, 'user-1');

      expect(result).toEqual({ id: 'user-1', username: 'Alice' });
    });

    it('handles errors', async () => {
      (mockPrisma as any).user = { update: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.update('user-1', {}, 'user-1')).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('rejects non-owner', async () => {
      await expect(
        controller.remove('other-user', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deletes own user', async () => {
      (mockPrisma as any).user = { delete: vi.fn().mockResolvedValue({ id: 'user-1' }) };

      const result = await controller.remove('user-1', 'user-1');

      expect(result).toEqual({ message: 'User deleted successfully!' });
    });

    it('handles errors', async () => {
      (mockPrisma as any).user = { delete: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.remove('user-1', 'user-1')).rejects.toThrow();
    });
  });

  describe('savePost', () => {
    it('creates a saved post', async () => {
      (mockPrisma as any).savedPost = {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: 'saved-1' }),
      };

      const result = await controller.savePost({ postId: 'post-1' }, 'user-1');

      expect(result).toEqual({ message: 'Post saved successfully!' });
    });

    it('deletes a saved post (toggle)', async () => {
      (mockPrisma as any).savedPost = {
        findUnique: vi.fn().mockResolvedValue({ id: 'saved-1' }),
        delete: vi.fn().mockResolvedValue({ id: 'saved-1' }),
      };

      const result = await controller.savePost({ postId: 'post-1' }, 'user-1');

      expect(result).toEqual({ message: 'Post unsaved successfully!' });
    });

    it('handles duplicate save race condition', async () => {
      const p2002Error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
        code: 'P2002',
        clientVersion: '5.13.0',
      });
      (mockPrisma as any).savedPost = {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockRejectedValue(p2002Error),
      };

      await expect(
        controller.savePost({ postId: 'post-1' }, 'user-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('handles general errors', async () => {
      (mockPrisma as any).savedPost = { findUnique: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.savePost({ postId: 'post-1' }, 'user-1')).rejects.toThrow();
    });
  });

  describe('getNotificationNumber', () => {
    it('returns unseen chat count', async () => {
      (mockPrisma as any).chat = { count: vi.fn().mockResolvedValue(3) };

      const result = await controller.getNotificationNumber('user-1');

      expect(result).toEqual({ count: 3 });
    });

    it('handles errors', async () => {
      (mockPrisma as any).chat = { count: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.getNotificationNumber('user-1')).rejects.toThrow();
    });
  });
});
