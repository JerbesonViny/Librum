import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
} from '@nestjs/common';

import { decodeToken } from '@/shared';
import { FindOneUser, USER_REPOSITORY } from '@/domain/contracts/repositories';
import { LibrarianEntity, UserEntity } from '@/domain/entities';

export class LibrarianGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: FindOneUser,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.replace('Bearer ', '');
    const decodedToken = decodeToken({ token });

    if (!decodedToken || decodedToken?.role != 'LIBRARIAN') {
      throw new HttpException('Librarian access is required.', 401);
    }

    const user = await this.userRepository.findOne({
      id: decodedToken.userId,
      role: 'LIBRARIAN',
    });

    if (!user) {
      throw new HttpException('User not found.', 401);
    }

    if (!this.isLibrarianGuard(user)) {
      throw new HttpException('Librarian access is required.', 401);
    }

    if (user.isDisabled()) {
      throw new HttpException('Disabled librarian.', 401);
    }

    if (!user.isApproved()) {
      throw new HttpException('Unapproved librarian.', 401);
    }

    return true;
  }

  private isLibrarianGuard(user: UserEntity): user is LibrarianEntity {
    return user.getRole() === 'LIBRARIAN';
  }
}
