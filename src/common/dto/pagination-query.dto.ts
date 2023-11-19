import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

enum SortBy {
  asc = 'asc',
  desc = 'desc',
}

export class PaginationSortQueryDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  sort_by: string;

  @ApiProperty({
    enum: SortBy,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortBy)
  order_by: SortBy;
}
