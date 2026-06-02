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
  @Transform(({ value }) => {
    const n = parseInt(value, 10);
    return isNaN(n) ? undefined : n;
  })
  @IsInt()
  bedroom?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const n = parseInt(value, 10);
    return isNaN(n) ? undefined : n;
  })
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const n = parseInt(value, 10);
    return isNaN(n) ? undefined : n;
  })
  @IsInt()
  maxPrice?: number;
}
