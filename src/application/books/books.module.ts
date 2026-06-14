import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BOOK_REPOSITORY } from '@/domain/contracts/repositories';
import { BookRepository } from '@/infra/repositories';
import { AuthorOrmEntity, BookOrmEntity } from '@/infra/database/typeorm';
import { CreateBookUseCase } from './usecases';
import { BooksController } from './books.controller';
import { AuthorsModule } from '@/application/authors/authors.module';

const BookRepositoryFactory = {
  provide: BOOK_REPOSITORY,
  useClass: BookRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([BookOrmEntity, AuthorOrmEntity]),
    AuthorsModule,
  ],
  controllers: [BooksController],
  providers: [
    // Usecases
    CreateBookUseCase,

    // Repositories
    BookRepositoryFactory,
  ],
  exports: [
    BookRepositoryFactory,
    TypeOrmModule.forFeature([BookOrmEntity, AuthorOrmEntity]),
  ],
})
export class BooksModule {}
