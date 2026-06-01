import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type as PostType, Property } from '@prisma/client';

export class CreatePostDetailDto {
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  utilities?: string;

  @IsOptional()
  @IsString()
  pet?: string;

  @IsOptional()
  @IsString()
  income?: string;

  @IsOptional()
  @IsInt()
  size?: number;

  @IsOptional()
  @IsInt()
  school?: number;

  @IsOptional()
  @IsInt()
  bus?: number;

  @IsOptional()
  @IsInt()
  restaurant?: number;
}

export class PostDataDto {
  @IsString()
  title: string;

  @IsInt()
  price: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsInt()
  bedroom: number;

  @IsInt()
  bathroom: number;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsEnum(PostType)
  type: PostType;

  @IsEnum(Property)
  property: Property;
}

export class CreatePostDto {
  @ValidateNested()
  @Type(() => PostDataDto)
  postData: PostDataDto;

  @ValidateNested()
  @Type(() => CreatePostDetailDto)
  postDetail: CreatePostDetailDto;
}
