import { UserConstructor, UserEntity, UserRoles } from './user.entity';

type AdminConstructor = Omit<UserConstructor, 'role'>;

export class AdminEntity extends UserEntity {
  protected readonly role: UserRoles = 'ADMIN';

  constructor(user: AdminConstructor) {
    super(user);

    this.validate();
  }
}
