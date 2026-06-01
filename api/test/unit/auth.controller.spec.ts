import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}));

describe('AuthController', () => {
  let controller: AuthController;

  const mockPrisma = {} as any;
  const mockJwtService = {
    sign: vi.fn().mockReturnValue('signed-token'),
    verify: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    vi.clearAllMocks();
  });

  const mockResponse = () => {
    const res: any = {
      cookie: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
    };
    return res as unknown as Response;
  };

  describe('register', () => {
    it('hashes password and creates a user', async () => {
      (mockPrisma as any).user = { create: vi.fn().mockResolvedValue({ id: 'user-1' }) };

      const result = await controller.register({ username: 'alice', email: 'alice@test.com', password: 'secret' });

      expect(result).toEqual({ message: 'User created successfully' });
    });

    it('handles errors', async () => {
      (mockPrisma as any).user = { create: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(
        controller.register({ username: 'alice', email: 'alice@test.com', password: 'secret' }),
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('rejects missing user', async () => {
      (mockPrisma as any).user = { findUnique: vi.fn().mockResolvedValue(null) };

      await expect(
        controller.login({ username: 'alice', password: 'secret' }, mockResponse()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects invalid password', async () => {
      (mockPrisma as any).user = { findUnique: vi.fn().mockResolvedValue({ id: 'user-1', username: 'alice', password: 'hashed' }) };
      const bcrypt = await import('bcrypt');
      (bcrypt.compare as any).mockResolvedValueOnce(false);

      await expect(
        controller.login({ username: 'alice', password: 'bad' }, mockResponse()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('logs in and sets cookie', async () => {
      (mockPrisma as any).user = {
        findUnique: vi.fn().mockResolvedValue({
          id: 'user-1', username: 'alice', password: 'hashed', email: 'alice@test.com',
        }),
      };

      const res = mockResponse();
      const result = await controller.login({ username: 'alice', password: 'secret' }, res);

      expect(res.cookie).toHaveBeenCalledWith('token', 'signed-token', expect.objectContaining({ httpOnly: true }));
      expect(result).toEqual({ id: 'user-1', username: 'alice', email: 'alice@test.com' });
    });
  });

  describe('logout', () => {
    it('clears the token cookie', () => {
      const res = mockResponse();
      const result = controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(result).toEqual({ message: 'Logout Successful' });
    });
  });
});
