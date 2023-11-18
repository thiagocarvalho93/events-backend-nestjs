import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  // @IsNotEmpty()
  // @IsString()
  // @Matches(/^(1[0-2]|0?[1-9]):([0-5]?[0-9])$/)
  // time: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  creator_id: number;
}
