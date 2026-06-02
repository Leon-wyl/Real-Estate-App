import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}

  async create(chatId: string, dto: CreateMessageDto, userId: string) {
    if (!dto.text || typeof dto.text !== 'string' || !dto.text.trim()) {
      throw new BadRequestException('Text is required!');
    }

    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        throw new NotFoundException('Chat not found!');
      }

      if (!chat.userIDs.includes(userId)) {
        throw new ForbiddenException('Not Authorized!');
      }

      const trimmedText = dto.text.trim();

      const message = await this.prisma.message.create({
        data: {
          text: trimmedText,
          userId,
          chatId,
        },
      });

      await this.prisma.chat.update({
        where: { id: chatId },
        data: {
          seenBy: [userId],
          lastMessage: trimmedText,
        },
      });

      this.socketService.emitToChat(chatId, 'newMessage', message);

      return message;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ForbiddenException ||
        err instanceof BadRequestException
      ) throw err;
      console.log(err);
      throw new InternalServerErrorException('Failed to add message!');
    }
  }
}
