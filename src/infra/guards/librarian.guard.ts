import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';

import { decodeToken } from '@/shared';

export class LibrarianGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization.replace('Bearer ', '');
    const decodedToken = decodeToken({ token });

    if (!decodedToken || decodedToken?.role != 'LIBRARIAN') {
      throw new HttpException('Librarian access is required.', 401);
    }

    return true;
  }
}
