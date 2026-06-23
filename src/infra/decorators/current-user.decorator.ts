import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { decodeToken } from '@/shared';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token: string = request.headers?.authorization?.replace(
      'Bearer ',
      '',
    );

    const decodedToken = decodeToken({ token });

    return decodedToken?.userId;
  },
);
