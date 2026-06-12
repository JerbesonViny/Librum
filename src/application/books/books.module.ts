import { Module } from '@nestjs/common';

import { BOOK_REPOSITORY } from '@/domain/contracts/repositories';
import { BookRepository } from '@/infra/repositories/book.repository';
import { CreateBookUsecase } from './usecases';
import { BooksController } from './books.controller';

const BookRepositoryFactory = {
  provide: BOOK_REPOSITORY,
  useClass: BookRepository,
};

@Module({
  controllers: [BooksController],
  providers: [
    // Usecases
    CreateBookUsecase,

    // Repositories
    BookRepositoryFactory,
  ],
})
export class BooksModule {}
