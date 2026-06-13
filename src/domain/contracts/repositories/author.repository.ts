import { AuthorEntity } from '@/domain/entities';
import { FindMany } from './generic.repository';

export const AUTHOR_REPOSITORY = Symbol('AUTHOR_REPOSITORY');

export type FindManyAuthorsInput = {
  authorIds?: string[];
};

export interface FindManyAuthors extends FindMany<
  FindManyAuthorsInput,
  AuthorEntity
> {}
