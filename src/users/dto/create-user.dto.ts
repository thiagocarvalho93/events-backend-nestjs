import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
