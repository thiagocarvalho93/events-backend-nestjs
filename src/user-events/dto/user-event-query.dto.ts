import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class UserEventQueryDto extends PaginationQueryDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  user_id: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  event_id: number;
}
