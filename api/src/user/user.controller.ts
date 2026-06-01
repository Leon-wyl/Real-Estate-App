import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SavePostDto } from './dto/save-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('notification')
  @UseGuards(JwtAuthGuard)
  getNotificationNumber(@CurrentUser('id') userId: string) {
    return this.userService.getNotificationNumber(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.userService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.userService.remove(id, userId);
  }

  @Post('save')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  savePost(
    @Body() dto: SavePostDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.userService.savePost(dto.postId, userId);
  }
}
