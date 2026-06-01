import { Controller, Get, Post, Put, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.chatService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.chatService.findOne(id, userId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() dto: CreateChatDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.chatService.create(dto, userId);
  }

  @Put('read/:id')
  read(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.chatService.read(id, userId);
  }
}
