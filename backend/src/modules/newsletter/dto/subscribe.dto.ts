import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class SubscribeDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;
}
