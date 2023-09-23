import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  fullName: String;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: String;

  @IsNotEmpty()
  @IsString()
  password: String;
}

export class LogInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: String;

  @IsNotEmpty()
  @IsString()
  password: String;
}