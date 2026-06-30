import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import { AuthorEntity } from '@/domain/entities';
import {
  AUTHOR_REPOSITORY,
  PaginatedAuthors,
} from '@/domain/contracts/repositories';

type Input = {
  page: number;
  pageSize: number;
  search?: string;
};

type Output = {
  records: number;
  page: number;
  items: AuthorEntity[];
};

@Injectable()
export class ListAuthorsUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: PaginatedAuthors,
  ) {}

  async perform(input: Input): Promise<Output | null> {
    return this.authorRepository.paginate(input);
  }
}
