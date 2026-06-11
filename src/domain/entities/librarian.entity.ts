import { UserConstructor, UserEntity } from './user.entity';

export class LibrarianEntity extends UserEntity {
  constructor(input: UserConstructor) {
    super(input);
  }
}
