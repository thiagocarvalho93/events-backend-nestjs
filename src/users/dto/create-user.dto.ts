import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
