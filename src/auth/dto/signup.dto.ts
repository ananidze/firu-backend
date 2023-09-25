import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ type: String, description: 'Password' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Username' })
  username: string;
}
