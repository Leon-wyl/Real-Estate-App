import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}

  async findAll(userId: string) {
    try {
      return await this.prisma.chat.findMany({
        where: {
          userIDs: { has: userId },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          users: {
            select: { id: true, username: true, avatar: true },
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to get chats!');
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id },
        include: {
          messages: {
            include: {
              sender: {
                select: { id: true, username: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!chat) {
        throw new NotFoundException('Chat not found!');
      }

      if (!chat.userIDs.includes(userId)) {
        throw new ForbiddenException('Not Authorized!');
      }

      return chat;
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) throw err;
      console.log(err);
      throw new InternalServerErrorException('Failed to get chat!');
    }
  }

  async create(dto: CreateChatDto, userId: string) {
    if (!dto.receiverId) {
      throw new BadRequestException('receiverId is required!');
    }

    try {
      const existing = await this.prisma.chat.findFirst({
        where: {
          userIDs: {
            hasEvery: [userId, dto.receiverId],
          },
        },
      });

      if (existing) {
        return existing;
      }

      const chat = await this.prisma.chat.create({
        data: {
          userIDs: [userId, dto.receiverId],
          seenBy: [userId],
        },
      });

      this.socketService.emitToUser(dto.receiverId, 'newChat', chat);

      return chat;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to create chat!');
    }
  }

  async read(id: string, userId: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id },
      });

      if (!chat) {
        throw new NotFoundException('Chat not found!');
      }

      if (!chat.userIDs.includes(userId)) {
        throw new ForbiddenException('Not Authorized!');
      }

      if (!chat.seenBy.includes(userId)) {
        const updatedChat = await this.prisma.chat.update({
          where: { id },
          data: {
            seenBy: {
              push: userId,
            },
          },
        });

        this.socketService.emitToChat(id, 'chatRead', { chatId: id, userId });

        return updatedChat;
      }

      return chat;
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) throw err;
      console.log(err);
      throw new InternalServerErrorException('Failed to read chat!');
    }
  }
}
