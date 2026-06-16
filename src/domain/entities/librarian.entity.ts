import {
  CannotApproveDisabledLibrarian,
  CannotLessOrEqualsThanError,
  EmptyFieldError,
} from '../../shared';
import { UserConstructor, UserEntity, UserRoles } from './user.entity';

export type LibrarianConstructor = UserConstructor & {
  approved?: boolean;
  disabled?: boolean;
  disabledAt?: Date;
  approvedAt?: Date;
};

type LibrarianStatus = 'DISABLED' | 'APPROVED' | 'PENDING_APPROVE';

export class LibrarianEntity extends UserEntity {
  protected readonly role: UserRoles = 'LIBRARIAN';
  private approved: boolean;
  private disabled: boolean;
  private disabledAt?: Date | undefined;
  private approvedAt?: Date | undefined;

  constructor({
    disabled,
    approved,
    approvedAt,
    disabledAt,
    ...user
  }: LibrarianConstructor) {
    super(user);
    this.approved = !!approved;
    this.disabled = !!disabled;
    this.approvedAt = approvedAt;
    this.disabledAt = disabledAt;

    this.validate();
  }

  protected validate() {
    super.validate();

    if (this.approved && !this.approvedAt) {
      throw new EmptyFieldError('approvedAt');
    }

    if (this.disabled && !this.disabledAt) {
      throw new EmptyFieldError('disabledAt');
    }

    if (
      this.approvedAt &&
      this.createdAt.getTime() > this.approvedAt.getTime()
    ) {
      throw new CannotLessOrEqualsThanError({
        shouldBeGreatherThan: 'approvedAt',
        target: 'createdAt',
      });
    }

    if (
      this.disabledAt &&
      this.createdAt.getTime() > this.disabledAt.getTime()
    ) {
      throw new CannotLessOrEqualsThanError({
        shouldBeGreatherThan: 'disabledAt',
        target: 'createdAt',
      });
    }
  }

  isApproved() {
    return this.approved;
  }

  isDisabled() {
    return this.disabled;
  }

  getApprovedAt() {
    return this.approvedAt;
  }

  getDisabledAt() {
    return this.disabledAt;
  }

  getStatus(): LibrarianStatus {
    if (this.isDisabled()) {
      return 'DISABLED';
    }

    if (this.isApproved()) {
      return 'APPROVED';
    }

    return 'PENDING_APPROVE';
  }

  markDisabled() {
    this.disabled = true;
    this.disabledAt = new Date();
  }

  markApproved() {
    if (this.disabled) {
      throw new CannotApproveDisabledLibrarian();
    }

    this.approved = true;
    this.approvedAt = new Date();
  }
}
