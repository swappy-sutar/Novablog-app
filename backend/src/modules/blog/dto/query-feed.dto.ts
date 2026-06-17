import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Min } from 'class-validator';

export class QueryFeedDto {
  @IsOptional()
  @IsEnum(['Latest', 'Trending', 'Following'])
  tab?: 'Latest' | 'Trending' | 'Following' = 'Latest';

  @IsOptional()
  @IsString()
  tag?: string = 'All';

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
