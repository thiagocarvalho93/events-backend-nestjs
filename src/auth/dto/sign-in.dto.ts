import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: String,
    default: 'thiago@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    type: String,
    default: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
