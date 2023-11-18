import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationQueryDto {
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
}
