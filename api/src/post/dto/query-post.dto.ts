import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryPostDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  property?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || undefined)
  @IsInt()
  bedroom?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || undefined)
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || undefined)
  @IsInt()
  maxPrice?: number;
}
