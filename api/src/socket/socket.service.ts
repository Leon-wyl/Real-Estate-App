import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private io: Server | null = null;

  setServer(server: Server) {
    this.io = server;
  }

  emitToUser(userId: string, event: string, data: any) {
    this.io?.to(userId).emit(event, data);
  }

  emitToChat(chatId: string, event: string, data: any) {
    this.io?.to(chatId).emit(event, data);
  }
}
