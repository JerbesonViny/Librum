import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LOAN_REPOSITORY } from '@/domain/contracts/repositories';
import { LoanRepository } from '@/infra/repositories';
import {
  AuthorOrmEntity,
  BookOrmEntity,
  LoanOrmEntity,
} from '@/infra/database/typeorm';
import { BooksModule } from '@/application/books/books.module';
import { AuthenticationModule } from '@/application/authentication/authentication.module';
import {
  CreateLoanUseCase,
  ListLoansByUserUseCase,
  ListLoansUseCase,
} from './usecases';
import { LoansController } from './loans.controller';

const LoanRepositoryFactory = {
  provide: LOAN_REPOSITORY,
  useClass: LoanRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanOrmEntity, BookOrmEntity, AuthorOrmEntity]),
    BooksModule,
    AuthenticationModule,
  ],
  controllers: [LoansController],
  providers: [
    // Usecases
    CreateLoanUseCase,
    ListLoansByUserUseCase,
    ListLoansUseCase,

    // Repositories
    LoanRepositoryFactory,
  ],
  exports: [LoanRepositoryFactory],
})
export class LoansModule {}
