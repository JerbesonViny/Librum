import { EntityId, LoanEntity } from '@/domain/entities';
import { FindOne } from './generic.repository';

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
