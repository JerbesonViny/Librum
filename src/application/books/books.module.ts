import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AUTHOR_REPOSITORY,
  BOOK_REPOSITORY,
} from '@/domain/contracts/repositories';
import { BookRepository, AuthorRepository } from '@/infra/repositories';
import { AuthorOrmEntity, BookOrmEntity } from '@/infra/database/typeorm';
import { CreateBookUseCase } from './usecases';
import { BooksController } from './books.controller';

const BookRepositoryFactory = {
  provide: BOOK_REPOSITORY,
  useClass: BookRepository,
};

const AuthorRepositoryFactory = {
  provide: AUTHOR_REPOSITORY,
  useClass: AuthorRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([BookOrmEntity, AuthorOrmEntity])],
  controllers: [BooksController],
  providers: [
    // Usecases
    CreateBookUseCase,

    // Repositories
    BookRepositoryFactory,
    AuthorRepositoryFactory,
  ],
})
export class BooksModule {}
