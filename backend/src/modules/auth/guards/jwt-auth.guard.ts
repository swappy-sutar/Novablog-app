import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (
      info?.message === 'No auth token' ||
      info?.message === 'No authorization token was found'
    ) {
      throw new UnauthorizedException({
        success: false,
        message: 'Access token not provided',
      });
    }

    // Token expired
    if (info?.message === 'jwt expired') {
      throw new UnauthorizedException({
        success: false,
        message: 'Access token expired',
      });
    }

    // Invalid token
    if (
      info?.message === 'invalid token' ||
      info?.name === 'JsonWebTokenError'
    ) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid access token',
      });
    }

    // Generic unauthorized
    if (err || !user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Unauthorized access',
      });
    }

    return user;
  }
}
