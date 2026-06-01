import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { TestController } from '../../src/test/test.controller';
import { JwtService } from '@nestjs/jwt';

describe('TestController', () => {
  let controller: TestController;

  const mockJwtService = {
    verify: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<TestController>(TestController);
    vi.clearAllMocks();
  });

  describe('shouldBeLoggedIn', () => {
    it('returns authenticated message', () => {
      const result = controller.shouldBeLoggedIn();

      expect(result).toEqual({ message: 'You are authenticated' });
    });
  });

  describe('shouldBeAdmin', () => {
    const mockReq = (cookies: any) => ({ cookies } as any);

    it('returns 401 when no token', () => {
      expect(() => controller.shouldBeAdmin(mockReq({}))).toThrow(UnauthorizedException);
    });

    it('returns 403 for invalid token', () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });

      expect(() => controller.shouldBeAdmin(mockReq({ token: 'bad' }))).toThrow(ForbiddenException);
    });

    it('returns 403 when not admin', () => {
      mockJwtService.verify.mockReturnValue({ id: 'user-1', isAdmin: false });

      expect(() => controller.shouldBeAdmin(mockReq({ token: 'valid' }))).toThrow(ForbiddenException);
    });

    it('returns success when admin', () => {
      mockJwtService.verify.mockReturnValue({ id: 'admin-1', isAdmin: true });

      const result = controller.shouldBeAdmin(mockReq({ token: 'valid' }));

      expect(result).toEqual({ message: 'You are authenticated' });
    });
  });
});
