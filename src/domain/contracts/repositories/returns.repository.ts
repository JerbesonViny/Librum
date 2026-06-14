import { EntityId, ReturnsEntity } from '@/domain/entities';
import { FindOne } from './generic.repository';

export const RETURNS_REPOSITORY = Symbol('RETURNS_REPOSITORY');

export type FindOneReturnsInput = {
  id?: EntityId;
  loanId?: EntityId;
};

export interface FindOneReturns extends FindOne<
  FindOneReturnsInput,
  ReturnsEntity
> {}
