import {
  Injectable,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users.map(({ password: _password, ...rest }) => rest);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to get users!');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      const { password: _password, ...rest } = user;
      return rest;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to get user!');
    }
  }

  async update(id: string, dto: UpdateUserDto, userId: string) {
    if (id !== userId) {
      throw new ForbiddenException('Not Authorized!');
    }

    try {
      const { password, avatar, ...inputs } = dto;

      let updatedPassword: string | null = null;
      if (password) {
        updatedPassword = await bcrypt.hash(password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...inputs,
          ...(updatedPassword && { password: updatedPassword }),
          ...(avatar && { avatar }),
        },
      });

      const { password: _password, ...rest } = user;
      return rest;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to update user!');
    }
  }

  async remove(id: string, userId: string) {
    if (id !== userId) {
      throw new ForbiddenException('Not Authorized!');
    }

    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'User deleted successfully!' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to delete user!');
    }
  }

  async savePost(postId: string, userId: string) {
    try {
      const savedPost = await this.prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (savedPost) {
        await this.prisma.savedPost.delete({ where: { id: savedPost.id } });
        return { message: 'Post unsaved successfully!' };
      } else {
        await this.prisma.savedPost.create({
          data: { userId, postId },
        });
        return { message: 'Post saved successfully!' };
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Post is already saved or unsaved');
      }
      console.log(err);
      throw new InternalServerErrorException('Failed to save post!');
    }
  }

  async getNotificationNumber(userId: string) {
    try {
      const count = await this.prisma.chat.count({
        where: {
          userIDs: { has: userId },
          NOT: {
            seenBy: { has: userId },
          },
        },
      });
      return { count };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to get notification count!');
    }
  }
}
