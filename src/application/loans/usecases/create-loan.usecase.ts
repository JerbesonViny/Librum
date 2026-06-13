import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import {
  BOOK_REPOSITORY,
  Create,
  FindOneBook,
  FindOneUser,
  GetPendingLoan,
  LOAN_REPOSITORY,
  USER_REPOSITORY,
} from '@/domain/contracts/repositories';
import {
  BookAlreadyLoanError,
  CreateEntityError,
  EmptyFieldError,
  EntityNotFound,
} from '@/shared';
import { EntityId, LoanEntity, TenantEntity } from '@/domain/entities';

type Input = {
  userId: string;
  bookId: string;
};

type Output = {
  loanId: string;
} | null;

@Injectable()
export class CreateLoanUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: FindOneBook,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: FindOneUser,
    @Inject(LOAN_REPOSITORY)
    private readonly loanRepository: GetPendingLoan &
      Create<LoanEntity, EntityId>,
  ) {}

  async perform(input: Input): Promise<Output | null> {
    this.validateInput(input);

    const bookId = new EntityId(input.bookId);
    const book = await this.bookRepository.findOne({
      id: bookId,
    });

    if (!book) {
      throw new EntityNotFound('Book');
    }

    const user = (await this.userRepository.findOne({
      id: new EntityId(input.userId),
      role: 'TENANT',
    })) as TenantEntity | null;

    if (!user) {
      throw new EntityNotFound('User');
    }

    const hasPendingLoan = await this.loanRepository.getPendingLoan({
      bookId,
    });

    if (hasPendingLoan) {
      throw new BookAlreadyLoanError();
    }

    const loan = new LoanEntity({
      book,
      tenant: user,
    });

    const loanId = await this.loanRepository.create(loan);

    if (!loanId) {
      throw new CreateEntityError('Loan');
    }

    return { loanId: loanId.toString() };
  }

  private validateInput(input: Input): void {
    if (!input.bookId) {
      throw new EmptyFieldError('bookId');
    }

    if (!input.userId) {
      throw new EmptyFieldError('userId');
    }
  }
}
