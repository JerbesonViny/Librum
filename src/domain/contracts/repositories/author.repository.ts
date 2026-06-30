import { AuthorEntity } from '@/domain/entities';
import { FindMany, Paginated, Pagination } from './generic.repository';

export const AUTHOR_REPOSITORY = Symbol('AUTHOR_REPOSITORY');

export type FindManyAuthorsInput = {
  authorIds?: string[];
};

export interface FindManyAuthors extends FindMany<
  FindManyAuthorsInput,
  AuthorEntity
> {}

export type PaginatedAuthorsInput = Pagination;

export interface PaginatedAuthors extends Paginated<
  PaginatedAuthorsInput,
  AuthorEntity
> {}
