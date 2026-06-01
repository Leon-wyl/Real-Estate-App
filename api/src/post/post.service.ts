import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPostDto) {
    try {
      return await this.prisma.post.findMany({
        where: {
          city: query.city || undefined,
          type: (query.type as any) || undefined,
          property: (query.property as any) || undefined,
          bedroom: query.bedroom || undefined,
          price: {
            gte: query.minPrice || 0,
            lte: query.maxPrice || 999999999,
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to get posts!');
    }
  }

  async findOne(id: string, userId?: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found!');
      }

      let isSaved = false;
      if (userId) {
        const saved = await this.prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId,
            },
          },
        });
        isSaved = !!saved;
      }

      return { ...post, isSaved };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      console.log(err);
      throw new InternalServerErrorException('Failed to get post!');
    }
  }

  async create(dto: CreatePostDto, userId: string) {
    try {
      return await this.prisma.post.create({
        data: {
          ...dto.postData,
          userId,
          postDetail: {
            create: dto.postDetail,
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to create post!');
    }
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } });

      if (!post) {
        throw new NotFoundException('Post not found!');
      }

      if (post.userId !== userId) {
        throw new ForbiddenException('Not Authorized!');
      }

      const { postDetail, ...postData } = dto;

      const data: any = { ...postData };

      if (postDetail) {
        data.postDetail = {
          upsert: {
            create: postDetail,
            update: postDetail,
          },
        };
      }

      return await this.prisma.post.update({
        where: { id },
        data,
        include: { postDetail: true },
      });
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) throw err;
      console.log(err);
      throw new InternalServerErrorException('Failed to update post!');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id } });

      if (!post) {
        throw new NotFoundException('Post not found!');
      }

      if (post.userId !== userId) {
        throw new ForbiddenException('Not Authorized!');
      }

      await this.prisma.post.delete({ where: { id } });
      return { message: 'Post deleted successfully!' };
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) throw err;
      console.log(err);
      throw new InternalServerErrorException('Failed to delete post!');
    }
  }
}
