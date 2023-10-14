import { Controller, Post, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  logout(@Req() req) {
    console.log(req);
    const token = req.get('Authorization').split(' ')[1];
    return { data: { message: 'Logout success' } };
    // return this.authService.logout(token);
  }
}
