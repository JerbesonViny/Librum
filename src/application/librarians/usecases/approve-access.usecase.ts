import { Inject, Injectable } from '@nestjs/common';

import {
  ApproveLibrarianAccess,
  FindOneUser,
  USER_REPOSITORY,
} from '@/domain/contracts/repositories';
import { UseCase } from '@/domain/contracts/usecases';
import { EmptyFieldError, UserNotFoundError } from '@/shared';
import { EntityId, LibrarianEntity, UserEntity } from '@/domain/entities';

type Input = {
  librarianId: string;
};

type Output = boolean;

@Injectable()
export class ApproveLibrarianAccessUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: FindOneUser & ApproveLibrarianAccess,
  ) {}

  async perform(input: Input): Promise<boolean | null> {
    if (!input.librarianId) {
      throw new EmptyFieldError('librarianId');
    }

    const id = new EntityId(input.librarianId);
    const user = await this.userRepository.findOne({
      id,
      role: 'LIBRARIAN',
    });

    if (!user || !this.librarianGuard(user)) {
      throw new UserNotFoundError();
    }

    user.markApproved();

    const success = await this.userRepository.approveLibrarianAccess(user);

    return !!success;
  }

  private librarianGuard(entity: UserEntity): entity is LibrarianEntity {
    return entity.getRole() === 'LIBRARIAN';
  }
}
