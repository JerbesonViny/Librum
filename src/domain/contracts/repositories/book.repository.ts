import { BookEntity, EntityId } from '@/domain/entities';
import { FindOne } from './generic.repository';

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');

export type FindOneBookInput = {
  id: EntityId;
};

export interface FindOneBook extends FindOne<FindOneBookInput, BookEntity> {}
