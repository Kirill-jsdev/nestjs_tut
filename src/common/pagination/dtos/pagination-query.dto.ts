import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Max(100)
  // @Type(() => Number) //this will transform the query string to a number but we have enabled implicit conversion in main.ts so no need to use this decorator here
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number) //this will transform the query string to a number but we have enabled implicit conversion in main.ts so no need to use this decorator here
  limit?: number = 10;
}
