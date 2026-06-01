import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { TestModule } from './test/test.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'fallback-secret',
      signOptions: { expiresIn: '7d' },
      global: true,
    }),
    PrismaModule,
    AuthModule,
    PostModule,
    UserModule,
    ChatModule,
    MessageModule,
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
