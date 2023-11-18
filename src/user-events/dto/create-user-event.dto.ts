import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateUserEventDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  event_id: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
