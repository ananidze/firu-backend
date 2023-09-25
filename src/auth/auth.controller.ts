import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('sign-up')
  create(@Body() signupDto: SignupDto) {
    return this.authService.create(signupDto);
  }

  @Post('refresh-token')
  refreshToken(@Body('token') token: string) {
    console.log('token', token);
    return this.authService.refreshToken(token);
  }

  @Delete('logout')
  logout(@Body('token') token: string) {
    return this.authService.logout(token);
  }
}
