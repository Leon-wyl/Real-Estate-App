import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.status(200).json({ message: 'Real Estate API is running!' });
  });

  app.use(cookieParser());
  app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(Number(process.env.PORT) || 8800);
}
bootstrap();
