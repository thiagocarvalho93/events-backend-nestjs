import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
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
