import { EntityId, LoanEntity } from '@/domain/entities';
import { FindOne, Paginated, Pagination } from './generic.repository';
import { LoanOrmEntity } from '@/infra/database/typeorm';

export const LOAN_REPOSITORY = Symbol('LOAN_REPOSITORY');

export type GetPendingLoanInput = {
  bookId: EntityId;
};

export interface GetPendingLoan {
  getPendingLoan(input: GetPendingLoanInput): Promise<boolean>;
}

export type FindOneLoanInput = {
  id: EntityId;
};

export interface FindOneLoan extends FindOne<FindOneLoanInput, LoanEntity> {}

export type PaginatedLoansInput = Pagination & { userId?: string };

export interface PaginatedLoans extends Paginated<
  PaginatedLoansInput,
  LoanOrmEntity
> {}
