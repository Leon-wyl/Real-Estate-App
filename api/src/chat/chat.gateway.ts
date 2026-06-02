import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';

@Injectable()
@WebSocketGateway({
  cors: { origin: process.env.CLIENT_URL, credentials: true },
})
export class ChatGateway implements OnModuleInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly socketService: SocketService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.socketService.setServer(this.server);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<{ id: string; isAdmin: boolean }>(token);
      client.join(payload.id);

      const chats = await this.prisma.chat.findMany({
        where: { userIDs: { has: payload.id } },
        select: { id: true },
      });

      chats.forEach((chat) => {
        client.join(chat.id);
      });
    } catch {
      client.disconnect();
    }
  }
}
