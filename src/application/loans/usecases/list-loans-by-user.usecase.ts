import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import {
  LOAN_REPOSITORY,
  PaginatedLoans,
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
    @Inject(LOAN_REPOSITORY)
    private readonly loanRepository: PaginatedLoans,
  ) {}

  async perform({ page, pageSize, userId }: Input): Promise<Output | null> {
    if (!userId) {
      throw new EmptyFieldError('userId');
    }

    return this.loanRepository.paginate({ page, pageSize, userId });
  }
}
