import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileNameDto {
  @IsNotEmpty()
  @IsString()
  fileId: String;

  @IsNotEmpty()
  @IsString()
  fileName: String;
}