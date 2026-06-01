import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { MessageController } from '../../src/message/message.controller';
import { MessageService } from '../../src/message/message.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SocketService } from '../../src/socket/socket.service';
import { JwtService } from '@nestjs/jwt';

describe('MessageController', () => {
  let controller: MessageController;

  const mockPrisma = {} as any;
  const mockSocketService = { emitToUser: vi.fn(), emitToChat: vi.fn() };
  const mockJwtService = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        MessageService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SocketService, useValue: mockSocketService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    vi.clearAllMocks();
  });

  describe('addMessage', () => {
    it('returns 400 when text is empty', async () => {
      await expect(
        controller.addMessage('chat-1', { text: '' }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns 400 when text is whitespace only', async () => {
      await expect(
        controller.addMessage('chat-1', { text: '   ' }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns 400 when text is missing', async () => {
      await expect(
        controller.addMessage('chat-1', { text: '' }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns 404 when chat missing', async () => {
      (mockPrisma as any).chat = { findUnique: vi.fn().mockResolvedValue(null) };

      await expect(
        controller.addMessage('chat-1', { text: 'hello' }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns 403 when user is not a member', async () => {
      (mockPrisma as any).chat = { findUnique: vi.fn().mockResolvedValue({ id: 'chat-1', userIDs: ['user-2'] }) };

      await expect(
        controller.addMessage('chat-1', { text: 'hello' }, 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('creates message and updates chat', async () => {
      const message = { id: 'msg-1', text: 'hello', userId: 'user-1', chatId: 'chat-1' };
      (mockPrisma as any).chat = {
        findUnique: vi.fn().mockResolvedValue({ id: 'chat-1', userIDs: ['user-1', 'user-2'] }),
        update: vi.fn().mockResolvedValue({}),
      };
      (mockPrisma as any).message = { create: vi.fn().mockResolvedValue(message) };

      const result = await controller.addMessage('chat-1', { text: 'hello' }, 'user-1');

      expect(result).toEqual(message);
    });
  });
});
