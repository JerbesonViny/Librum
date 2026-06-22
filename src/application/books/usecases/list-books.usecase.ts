import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import { BookEntity } from '@/domain/entities';
import {
  BOOK_REPOSITORY,
  PaginatedBooks,
} from '@/domain/contracts/repositories';

type Input = {
  page: number;
  pageSize: number;
  search?: string;
};

type Output = {
  records: number;
  page: number;
  items: BookEntity[];
};

@Injectable()
export class ListBooksUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: PaginatedBooks,
  ) {}

  async perform(input: Input): Promise<Output | null> {
    return this.bookRepository.paginate(input);
  }
}
