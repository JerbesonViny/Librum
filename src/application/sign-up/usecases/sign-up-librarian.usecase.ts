import { Inject, Injectable } from '@nestjs/common';

import {
  CreateEntityError,
  CreateHashError,
  EmailAlreadyUsedError,
  createHash,
} from '@/shared';
import {
  GetUserByEmail,
  USER_REPOSITORY,
  Create,
} from '@/domain/contracts/repositories';
import { EntityId, LibrarianEntity, UserRoles } from '@/domain/entities';

type Input = {
  email: string;
  password: string;
  name: string;
  lastName: string;
};

type Output = {
  librarianId: string;
} | null;

@Injectable()
export class SignUpLibrarianUseCase {
  private readonly role: UserRoles = 'LIBRARIAN';

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: GetUserByEmail<LibrarianEntity> &
      Create<LibrarianEntity, EntityId>,
  ) {}
  async perform({ email, password, name, lastName }: Input): Promise<Output> {
    const formattedEmail = email.trim();
    const user = await this.userRepository.getUserByEmail({
      email: formattedEmail,
      role: this.role,
    });

    if (user) {
      throw new EmailAlreadyUsedError();
    }

    const librarian = new LibrarianEntity({
      email: formattedEmail,
      name,
      lastName,
      password,
    });

    const hashedPassword = createHash(librarian.getPassword());

    if (!hashedPassword) {
      throw new CreateHashError();
    }

    librarian.setPassword(hashedPassword);

    const librarianId = await this.userRepository.create(librarian);

    if (!librarianId) {
      throw new CreateEntityError('Librarian');
    }

    return { librarianId: librarianId.toString() };
  }
}
