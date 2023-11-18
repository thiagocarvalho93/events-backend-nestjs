import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  creator_id: number;
}
