import { Inject } from '@nestjs/common';
import { UseCase } from '@/domain/contracts/usecases';
import {
  Create,
  FindOneLoan,
  FindOneReturns,
  LOAN_REPOSITORY,
  RETURNS_REPOSITORY,
} from '@/domain/contracts/repositories';
import {
  BookAlreadyReturnedError,
  CreateEntityError,
  EmptyFieldError,
  EntityNotFound,
} from '@/shared';
import { EntityId, ReturnsEntity } from '@/domain/entities';

type Input = {
  loanId: string;
};

type Output = {
  returnsId: string;
};

export class CreateReturnsUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(LOAN_REPOSITORY)
    private readonly loanRepository: FindOneLoan,
    @Inject(RETURNS_REPOSITORY)
    private readonly returnsRepository: FindOneReturns &
      Create<ReturnsEntity, EntityId>,
  ) {}

  async perform(input: Input): Promise<Output | null> {
    if (!input.loanId) {
      throw new EmptyFieldError('loanId');
    }

    const loanId = new EntityId(input.loanId);
    const loan = await this.loanRepository.findOne({ id: loanId });

    if (!loan) {
      throw new EntityNotFound('Loan');
    }

    const returnsExists = await this.returnsRepository.findOne({ loanId });

    if (returnsExists) {
      throw new BookAlreadyReturnedError();
    }

    const returns = new ReturnsEntity({
      loan,
    });
    const returnsId = await this.returnsRepository.create(returns);

    if (!returnsId) {
      throw new CreateEntityError('Returns');
    }

    return { returnsId: returnsId.toString() };
  }
}
