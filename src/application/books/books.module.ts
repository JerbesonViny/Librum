import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BOOK_REPOSITORY } from '@/domain/contracts/repositories';
import { BookRepository } from '@/infra/repositories';
import { AuthorOrmEntity, BookOrmEntity } from '@/infra/database/typeorm';
import { CreateBookUseCase, ListBooksUseCase } from './usecases';
import { BooksController } from './books.controller';
import { AuthorsModule } from '@/application/authors/authors.module';
import { AuthenticationModule } from '@/application/authentication/authentication.module';

const BookRepositoryFactory = {
  provide: BOOK_REPOSITORY,
  useClass: BookRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([BookOrmEntity, AuthorOrmEntity]),
    AuthorsModule,
    AuthenticationModule,
  ],
  controllers: [BooksController],
  providers: [
    // Usecases
    CreateBookUseCase,
    ListBooksUseCase,

    // Repositories
    BookRepositoryFactory,
  ],
  exports: [
    BookRepositoryFactory,
    TypeOrmModule.forFeature([BookOrmEntity, AuthorOrmEntity]),
  ],
})
export class BooksModule {}
