import { UserConstructor, UserEntity, UserRoles } from './user.entity';

export class LibrarianEntity extends UserEntity {
  protected readonly role: UserRoles = 'LIBRARIAN';

  constructor({ ...user }: UserConstructor) {
    super(user);
  }
}
