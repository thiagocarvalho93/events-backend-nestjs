import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { PaginationSortQueryDto } from 'src/common/dto/pagination-query.dto';

export class CommentQueryDto extends PaginationSortQueryDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  event_id: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  user_id: number;
}
