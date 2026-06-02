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

export class UpdatePostDetailDto {
  @IsOptional()
  @IsString()
  desc?: string;

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

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsInt()
  bedroom?: number;

  @IsOptional()
  @IsInt()
  bathroom?: number;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsEnum(Property)
  property?: Property;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePostDetailDto)
  postDetail?: UpdatePostDetailDto;
}
