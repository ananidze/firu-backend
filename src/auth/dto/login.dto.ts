import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'Email' })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}
