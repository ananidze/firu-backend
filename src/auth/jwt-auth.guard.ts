import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    console.log(err, user, info);
    if (err || info || !user) {
      return null;
    }
    return user;
  }
}
