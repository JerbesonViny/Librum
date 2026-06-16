import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';

import { decodeToken } from '@/shared';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization.replace('Bearer ', '');
    const decodedToken = decodeToken({ token });

    if (!decodedToken || decodedToken?.role != 'ADMIN') {
      throw new HttpException('Admin access is required.', 401);
    }

    return true;
  }
}
