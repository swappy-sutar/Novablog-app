import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class QueryFeedDto {
  @IsOptional()
  @IsEnum(['Latest', 'Trending', 'Following'])
  tab?: 'Latest' | 'Trending' | 'Following' = 'Latest';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tag?: string = 'All';

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(1000000)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
