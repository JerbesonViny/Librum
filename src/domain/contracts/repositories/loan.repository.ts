import { EntityId } from '@/domain/entities';

export const LOAN_REPOSITORY = Symbol('LOAN_REPOSITORY');

export type GetPendingLoanInput = {
  bookId: EntityId;
};

export interface GetPendingLoan {
  getPendingLoan(input: GetPendingLoanInput): Promise<boolean>;
}
