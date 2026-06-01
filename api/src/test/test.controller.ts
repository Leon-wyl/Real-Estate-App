import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('test')
export class TestController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('should-be-logged-in')
  @UseGuards(JwtAuthGuard)
  shouldBeLoggedIn() {
    return { message: 'You are authenticated' };
  }

  @Get('should-be-admin')
  shouldBeAdmin(@Req() req: Request) {
    const token = req.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('Not Authenticated!');
    }

    let payload: { id: string; isAdmin: boolean };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new ForbiddenException('Token not valid!');
    }

    if (!payload.isAdmin) {
      throw new ForbiddenException('Not authorized!');
    }

    return { message: 'You are authenticated' };
  }
}
