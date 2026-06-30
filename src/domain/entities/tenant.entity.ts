import { DateTime } from 'luxon';

import {
  EmptyFieldError,
  FutureBirthDateError,
  BirthDateFormatError,
} from '@/shared';
import { UserConstructor, UserEntity, UserRoles } from './user.entity';

type TenantConstructor = Omit<UserConstructor, 'role'> & { birthDate: string };

export class TenantEntity extends UserEntity {
  protected birthDate: string;
  protected readonly role: UserRoles = 'TENANT';

  constructor({ birthDate, ...user }: TenantConstructor) {
    super(user);
    this.birthDate = birthDate;

    this.validate();
  }

  protected validate(): void {
    super.validate();

    if (!this.birthDate) {
      throw new EmptyFieldError('birthDate');
    }

    const parsedBirthDate = DateTime.fromFormat(this.birthDate, 'yyyyMMdd');

    if (!parsedBirthDate.isValid) {
      throw new BirthDateFormatError();
    }

    if (parsedBirthDate >= DateTime.now()) {
      throw new FutureBirthDateError();
    }
  }

  getBirthDate() {
    return this.birthDate;
  }
}
