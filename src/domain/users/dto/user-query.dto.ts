import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationSortQueryDto } from 'src/common/dto/pagination-query.dto';

export class UserQueryDto extends PaginationSortQueryDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  username: string;
}
