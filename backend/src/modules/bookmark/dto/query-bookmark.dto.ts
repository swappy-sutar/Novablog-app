import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class QueryBookmarkDto {
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
