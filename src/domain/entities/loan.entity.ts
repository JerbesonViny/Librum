import { CannotLessOrEqualsThanError, EmptyFieldError } from '@/shared';
import { BookEntity } from './book.entity';
import { EntityId } from './id.entity';
import { TenantEntity } from './tenant.entity';

export type LoanConstructor = {
  id?: EntityId;
  tenant: TenantEntity;
  book: BookEntity;
  createdAt?: Date;
  dueDate?: Date;
};

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export class LoanEntity {
  private id: EntityId;
  private readonly tenant: TenantEntity;
  private readonly book: BookEntity;
  private readonly dueDate: Date;
  private readonly createdAt: Date;

  constructor({ id, createdAt, dueDate, tenant, book }: LoanConstructor) {
    this.id = id ?? new EntityId();
    this.createdAt = createdAt ?? new Date();
    this.dueDate = dueDate ?? this.generateDueDate(this.createdAt);
    this.tenant = tenant;
    this.book = book;

    this.validate();
  }

  private generateDueDate(createdAt: Date): Date {
    const deadLineDays = 15;

    const createdAtInMilliseconds = createdAt.getTime();
    const dueDateInMilliseconds =
      createdAtInMilliseconds + deadLineDays * DAY_IN_MILLISECONDS;

    return new Date(dueDateInMilliseconds);
  }

  private validate() {
    if (!this.createdAt) {
      throw new EmptyFieldError('createdAt');
    }

    if (!this.dueDate) {
      throw new EmptyFieldError('dueDate');
    }

    if (this.dueDate.getTime() < this.createdAt.getTime()) {
      throw new CannotLessOrEqualsThanError({
        shouldBeGreatherThan: 'dueDate',
        target: 'createdAt',
      });
    }
  }

  getId() {
    return this.id;
  }

  getTenant() {
    return this.tenant;
  }

  getBook() {
    return this.book;
  }

  getDueDate() {
    return this.dueDate;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
