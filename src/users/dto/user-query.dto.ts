import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class UserQueryDto extends PaginationQueryDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  username: string;
}
