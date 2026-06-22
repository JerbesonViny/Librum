import { BookEntity, EntityId } from '@/domain/entities';
import { FindOne, Paginated, Pagination } from './generic.repository';

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');

export type FindOneBookInput = {
  id: EntityId;
};

export interface FindOneBook extends FindOne<FindOneBookInput, BookEntity> {}

export type PaginatedBooksInput = Pagination & { search?: string };

export interface PaginatedBooks extends Paginated<
  PaginatedBooksInput,
  BookEntity
> {}
