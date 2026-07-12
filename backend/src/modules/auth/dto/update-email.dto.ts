import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  newEmail: string;
}
