import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { sanitezeUser } from 'src/common/utils/sanitezeUser';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const tokens = await this.generateTokens(user);

      await this.prisma.refreshToken.create({
        data: { token: tokens.refreshToken, userId: user.id },
      });

      return { data: { tokens, user: sanitezeUser(user) } };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(signupDto: SignupDto): Promise<any> {
    try {
      const { email, password, username } = signupDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, username },
      });

      const tokens = await this.generateTokens(user);

      return { data: { tokens, user: sanitezeUser(user) } };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(rt: string) {
    try {
      if (!rt) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const decoded = this.jwtService.decode(rt) as any;
      if (!decoded) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const refreshTokenDoc = await this.prisma.refreshToken.findUnique({
        where: { token: rt },
      });

      if (!refreshTokenDoc) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: refreshTokenDoc.userId },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken } = await this.generateTokens(user);

      return { data: { tokens: { accessToken }, user: sanitezeUser(user) } };
    } catch (error) {
      await this.prisma.refreshToken.delete({
        where: { token: rt },
      });

      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async generatePermissionsForRole(role: string) {
    const roleDoc = await this.prisma.role.findUnique({
      where: { name: role },
    });
    // console.log(roleDoc);
    if (!roleDoc) {
      return [];
    }

    return roleDoc.permissions;
  }

  async generateTokens(user: any) {
    const { role } = user;
    console.log(user);

    const permissions = await this.generatePermissionsForRole(role);
    const accessToken = this.jwtService.sign({
      _id: user.id,
      permissions,
      role: user.role,
    });
    const refreshToken = this.jwtService.sign(
      { _id: user.id },
      { expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }

  async logout(token: string) {
    await this.prisma.refreshToken.delete({
      where: { token },
    });

    return { data: { message: 'Logout successfully' } };
  }
}
