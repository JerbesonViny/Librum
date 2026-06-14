import { Injectable } from '@nestjs/common';
import {
  Create,
  FindOneLoan,
  FindOneLoanInput,
  GetPendingLoan,
  GetPendingLoanInput,
} from '@/domain/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanOrmEntity } from '@/infra/database/typeorm';
import { EntityId, LoanEntity } from '@/domain/entities';

@Injectable()
export class LoanRepository
  implements GetPendingLoan, FindOneLoan, Create<LoanEntity, EntityId>
{
  constructor(
    @InjectRepository(LoanOrmEntity)
    private readonly repository: Repository<LoanOrmEntity>,
  ) {}

  async getPendingLoan(input: GetPendingLoanInput): Promise<boolean> {
    const query = this.repository
      .createQueryBuilder('loan')
      .where('loan.book_id = :id', { id: input.bookId.toString() })
      .leftJoinAndSelect('loan.returns', 'return')
      .andWhere('return.loan_id IS NULL');

    return query.getExists();
  }

  async findOne(input: FindOneLoanInput): Promise<LoanEntity | null> {
    const query = this.repository
      .createQueryBuilder('loan')
      .where('loan.id = :id', { id: input.id.toString() })
      .innerJoinAndSelect('loan.user', 'user')
      .innerJoinAndSelect('loan.book', 'book')
      .innerJoinAndSelect('book.authors', 'authors');

    const loan = await query.getOne();

    if (!loan) {
      return null;
    }

    return loan.toDomain();
  }

  async create(entity: LoanEntity): Promise<EntityId | null> {
    const loan = this.repository.create({
      id: entity.getId().toString(),
      book: entity.getBook(),
      user: entity.getTenant(),
      dueDate: entity.getDueDate(),
    } as unknown as LoanOrmEntity);

    try {
      await this.repository.insert(loan);
    } catch (error) {
      console.log(error);
      return null;
    }

    return entity.getId();
  }
}
