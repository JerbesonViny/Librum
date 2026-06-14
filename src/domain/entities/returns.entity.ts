import { EmptyFieldError } from '@/shared';
import { EntityId } from './id.entity';
import { LoanEntity } from './loan.entity';

export type ReturnsConstructor = {
  id?: EntityId;
  loan: LoanEntity;
  createdAt?: Date;
};

export class ReturnsEntity {
  private readonly id: EntityId;
  private readonly loan: LoanEntity;
  private readonly createdAt: Date;

  constructor({ id, loan, createdAt }: ReturnsConstructor) {
    this.id = id ?? new EntityId();
    this.loan = loan;
    this.createdAt = createdAt ?? new Date();

    this.validate();
  }

  private validate() {
    if (!this.loan) {
      throw new EmptyFieldError('loan');
    }
  }

  getId() {
    return this.id;
  }

  getLoan() {
    return this.loan;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
