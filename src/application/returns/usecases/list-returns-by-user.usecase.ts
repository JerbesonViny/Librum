import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import {
  PaginatedReturns,
  RETURNS_REPOSITORY,
} from '@/domain/contracts/repositories';

import { ReturnsLoanOrmEntity } from '@/infra/database/typeorm';
import { EmptyFieldError } from '@/shared';

type Input = {
  userId?: string;
  page: number;
  pageSize: number;
};

type Output = {
  page: number;
  records: number;
  items: ReturnsLoanOrmEntity[];
};

@Injectable()
export class ListReturnsByUserUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(RETURNS_REPOSITORY)
    private readonly returnsRepository: PaginatedReturns,
  ) {}

  async perform({ page, pageSize, userId }: Input): Promise<Output | null> {
    if (!userId) {
      throw new EmptyFieldError('userId');
    }

    return this.returnsRepository.paginate({ page, pageSize, userId });
  }
}
