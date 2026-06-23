import { Injectable } from '@nestjs/common';
import {
  Create,
  FindOneLoan,
  FindOneLoanInput,
  GetPendingLoan,
  GetPendingLoanInput,
  PaginatedLoans,
  PaginatedLoansInput,
  PaginatedOutput,
} from '@/domain/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LoanOrmEntity } from '@/infra/database/typeorm';
import { EntityId, LoanEntity } from '@/domain/entities';
import { buildPaginationParams } from '@/shared/utils/database.utils';

type BuildPaginateParams = {
  input: PaginatedLoansInput;
  query: SelectQueryBuilder<LoanOrmEntity>;
};

@Injectable()
export class LoanRepository
  implements
    GetPendingLoan,
    FindOneLoan,
    Create<LoanEntity, EntityId>,
    PaginatedLoans
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
      .addSelect('user.password')
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

  async paginate(
    input: PaginatedLoansInput,
  ): Promise<PaginatedOutput<LoanOrmEntity> | null> {
    const { page, skip, pageSize } = buildPaginationParams(input);

    const query = this.buildPaginateQuery(input);

    const [loans, records] = await query
      .skip(skip)
      .limit(pageSize)
      .getManyAndCount();

    return {
      page,
      records,
      items: loans,
    };
  }

  private buildPaginateQuery(input: PaginatedLoansInput) {
    let baseQuery = this.repository
      .createQueryBuilder('loan')
      .innerJoinAndSelect('loan.book', 'book');

    baseQuery = this.buildExtraJoins({ query: baseQuery, input });
    baseQuery = this.buildWhereConditions({ query: baseQuery, input });

    return baseQuery.addOrderBy('loan.id');
  }

  private buildExtraJoins({ input, query }: BuildPaginateParams) {
    const copyQuery = query;

    if (input.shouldResolveReturns) {
      copyQuery.leftJoinAndSelect('loan.returns', 'returns');
    }

    if (input.shouldResolveUsers) {
      copyQuery.innerJoinAndSelect('loan.user', 'user');
    }

    return copyQuery;
  }

  private buildWhereConditions({ input, query }: BuildPaginateParams) {
    const copyQuery = query;

    if (input.userId) {
      copyQuery.andWhere('loan.user_id = :id', {
        id: input.userId?.toString(),
      });
    }

    return copyQuery;
  }
}
