import { Injectable } from '@nestjs/common';
import {
  Create,
  FindOneReturns,
  FindOneReturnsInput,
} from '@/domain/contracts/repositories';
import { Repository } from 'typeorm';
import { ReturnsLoanOrmEntity } from '../database/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityId, ReturnsEntity } from '@/domain/entities';
import { EmptyFieldError } from '@/shared';

@Injectable()
export class ReturnsRepository
  implements FindOneReturns, Create<ReturnsEntity, EntityId>
{
  constructor(
    @InjectRepository(ReturnsLoanOrmEntity)
    private readonly repository: Repository<ReturnsLoanOrmEntity>,
  ) {}

  async findOne(input: FindOneReturnsInput): Promise<ReturnsEntity | null> {
    if (!input.loanId && !input.id) {
      throw new EmptyFieldError('loadId or id');
    }

    const query = this.repository
      .createQueryBuilder('returns')
      .where('returns.loan_id = :loanId', { loanId: input.loanId?.toString() })
      .innerJoinAndSelect('returns.loan', 'loan')
      .innerJoinAndSelect('loan.user', 'user')
      .innerJoinAndSelect('loan.book', 'book')
      .innerJoinAndSelect('book.authors', 'authors');

    const returns = await query.getOne();

    if (!returns) {
      return null;
    }

    return returns.toDomain();
  }

  async create(entity: ReturnsEntity): Promise<EntityId | null> {
    const returns = this.repository.create({
      id: entity.getId().toString(),
      loan: entity.getLoan(),
      createdAt: entity.getCreatedAt(),
    } as unknown as ReturnsLoanOrmEntity);

    try {
      await this.repository.save(returns);
    } catch (error) {
      console.log(error);
      return null;
    }

    return entity.getId();
  }
}
