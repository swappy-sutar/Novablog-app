import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { BlogStatus } from '@prisma/client';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  'tags[]'?: string[];
}
