import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { decodeToken } from '@/shared';

export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.replace('Bearer ', '');
    const decodedToken = decodeToken({ token });

    if (!decodedToken || decodedToken?.role != 'TENANT') {
      throw new HttpException('Tenant access is required.', 401);
    }

    return true;
  }
}
