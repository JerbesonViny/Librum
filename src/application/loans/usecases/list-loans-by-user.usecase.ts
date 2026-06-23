import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import {
  FindOneUser,
  LOAN_REPOSITORY,
  PaginatedLoans,
  USER_REPOSITORY,
} from '@/domain/contracts/repositories';

import { LoanOrmEntity } from '@/infra/database/typeorm';
import { EmptyFieldError } from '@/shared';

type Input = {
  userId?: string;
  page: number;
  pageSize: number;
};

type Output = {
  page: number;
  records: number;
  items: LoanOrmEntity[];
};

@Injectable()
export class ListLoansByUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: FindOneUser,
    @Inject(LOAN_REPOSITORY)
    private readonly loanRepository: PaginatedLoans,
  ) {}

  async perform(input: Input): Promise<Output | null> {
    if (!input.userId) {
      throw new EmptyFieldError('userId');
    }

    return this.loanRepository.paginate(input);
  }
}
