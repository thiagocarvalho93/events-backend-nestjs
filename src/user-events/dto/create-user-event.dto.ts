import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { UserEventStatus } from './status.enum';

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

  @IsNotEmpty()
  @ApiProperty({
    enum: UserEventStatus,
    example: Object.values(UserEventStatus),
  })
  @IsEnum(UserEventStatus)
  status: UserEventStatus;
}
