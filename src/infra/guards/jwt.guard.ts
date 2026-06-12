import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { isValidToken } from '@/shared';
import configuration from '@/infra/environments/environments.config';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token: string | null = request.headers?.authorization?.replace(
      'Bearer ',
      '',
    );

    if (!token) {
      throw new HttpException('Token is required.', HttpStatus.UNAUTHORIZED);
    }

    const privateKey = configuration().jwt.secretKey;
    if (!isValidToken({ token, privateKey })) {
      throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
