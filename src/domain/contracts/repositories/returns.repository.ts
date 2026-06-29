import { EntityId, ReturnsEntity } from '@/domain/entities';
import { FindOne, Paginated, Pagination } from './generic.repository';
import { ReturnsLoanOrmEntity } from '@/infra/database/typeorm';

export const RETURNS_REPOSITORY = Symbol('RETURNS_REPOSITORY');

export type FindOneReturnsInput = {
  id?: EntityId;
  loanId?: EntityId;
};

export interface FindOneReturns extends FindOne<
  FindOneReturnsInput,
  ReturnsEntity
> {}

export type PaginatedReturnsInput = Pagination & {
  userId?: string;
  shouldResolveReturns?: boolean;
  shouldResolveUsers?: boolean;
};

export interface PaginatedReturns extends Paginated<
  PaginatedReturnsInput,
  ReturnsLoanOrmEntity
> {}
