import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ChatController } from '../../src/chat/chat.controller';
import { ChatService } from '../../src/chat/chat.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SocketService } from '../../src/socket/socket.service';
import { JwtService } from '@nestjs/jwt';

describe('ChatController', () => {
  let controller: ChatController;

  const mockPrisma = {} as any;
  const mockSocketService = { emitToUser: vi.fn(), emitToChat: vi.fn() };
  const mockJwtService = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SocketService, useValue: mockSocketService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns chats for user', async () => {
      const chats = [{ id: 'chat-1', userIDs: ['user-1', 'user-2'] }];
      (mockPrisma as any).chat = { findMany: vi.fn().mockResolvedValue(chats) };

      const result = await controller.findAll('user-1');

      expect(result).toEqual(chats);
    });

    it('handles errors', async () => {
      (mockPrisma as any).chat = { findMany: vi.fn().mockRejectedValue(new Error('db error')) };

      await expect(controller.findAll('user-1')).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('returns 404 when missing', async () => {
      (mockPrisma as any).chat = { findUnique: vi.fn().mockResolvedValue(null) };

      await expect(controller.findOne('chat-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('returns 403 when user is not a member', async () => {
      (mockPrisma as any).chat = { findUnique: vi.fn().mockResolvedValue({ id: 'chat-1', userIDs: ['user-2', 'user-3'] }) };

      await expect(controller.findOne('chat-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('returns chat when user is a member', async () => {
      (mockPrisma as any).chat = {
        findUnique: vi.fn().mockResolvedValue({ id: 'chat-1', userIDs: ['user-1', 'user-2'], messages: [] }),
      };

      const result = await controller.findOne('chat-1', 'user-1');

      expect(result).toEqual({ id: 'chat-1', userIDs: ['user-1', 'user-2'], messages: [] });
    });
  });

  describe('create', () => {
    it('returns existing chat if found', async () => {
      const existing = { id: 'chat-1', userIDs: ['user-1', 'user-2'] };
      (mockPrisma as any).chat = {
        findFirst: vi.fn().mockResolvedValue(existing),
        create: vi.fn(),
      };

      const result = await controller.create({ receiverId: 'user-2' }, 'user-1');

      expect(result).toEqual(existing);
    });

    it('creates new chat if none exists', async () => {
      const newChat = { id: 'chat-2', userIDs: ['user-1', 'user-2'] };
      (mockPrisma as any).chat = {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(newChat),
      };

      const result = await controller.create({ receiverId: 'user-2' }, 'user-1');

      expect(result).toEqual(newChat);
    });

    it('returns 400 when receiverId is missing', async () => {
      await expect(
        controller.create({ receiverId: '' }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('read', () => {
    it('marks chat as seen', async () => {
      const updated = { id: 'chat-1', seenBy: ['user-1'] };
      (mockPrisma as any).chat = {
        findUnique: vi.fn().mockResolvedValue({ id: 'chat-1', userIDs: ['user-1', 'user-2'], seenBy: [] }),
        update: vi.fn().mockResolvedValue(updated),
      };

      const result = await controller.read('chat-1', 'user-1');

      expect(result).toEqual(updated);
    });

    it('returns chat without update when already seen', async () => {
      const chat = { id: 'chat-1', userIDs: ['user-1', 'user-2'], seenBy: ['user-1'] };
      (mockPrisma as any).chat = {
        findUnique: vi.fn().mockResolvedValue(chat),
        update: vi.fn(),
      };

      const result = await controller.read('chat-1', 'user-1');

      expect(result).toEqual(chat);
    });

    it('returns 404 when missing', async () => {
      (mockPrisma as any).chat = { findUnique: vi.fn().mockResolvedValue(null) };

      await expect(controller.read('chat-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('returns 403 when not a member', async () => {
      (mockPrisma as any).chat = { findUnique: vi.fn().mockResolvedValue({ id: 'chat-1', userIDs: ['user-2', 'user-3'] }) };

      await expect(controller.read('chat-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });
});
