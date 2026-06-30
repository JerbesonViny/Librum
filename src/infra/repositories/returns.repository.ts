import { Injectable } from '@nestjs/common';
import {
  Create,
  FindOneReturns,
  FindOneReturnsInput,
  PaginatedOutput,
  PaginatedReturns,
  PaginatedReturnsInput,
} from '@/domain/contracts/repositories';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ReturnsLoanOrmEntity } from '@/infra/database/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityId, ReturnsEntity } from '@/domain/entities';
import { EmptyFieldError } from '@/shared';
import { buildPaginationParams } from '@/shared/utils/database.utils';

type BuildPaginateParams = {
  input: PaginatedReturnsInput;
  query: SelectQueryBuilder<ReturnsLoanOrmEntity>;
};

@Injectable()
export class ReturnsRepository
  implements FindOneReturns, Create<ReturnsEntity, EntityId>, PaginatedReturns
{
  constructor(
    @InjectRepository(ReturnsLoanOrmEntity)
    private readonly repository: Repository<ReturnsLoanOrmEntity>,
  ) {}

  async findOne(input: FindOneReturnsInput): Promise<ReturnsEntity | null> {
    if (!input.loanId) {
      throw new EmptyFieldError('loadId');
    }

    const query = this.repository
      .createQueryBuilder('returns')
      .where('returns.loan_id = :loanId', { loanId: input.loanId?.toString() })
      .innerJoinAndSelect('returns.loan', 'loan')
      .innerJoinAndSelect('loan.user', 'user')
      .addSelect('user.password')
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

  async paginate(
    input: PaginatedReturnsInput,
  ): Promise<PaginatedOutput<ReturnsLoanOrmEntity> | null> {
    const { page, skip, pageSize } = buildPaginationParams(input);

    const query = this.buildPaginateQuery(input);

    const [returns, records] = await query
      .skip(skip)
      .limit(pageSize)
      .getManyAndCount();

    return {
      page,
      records,
      items: returns,
    };
  }

  private buildPaginateQuery(input: PaginatedReturnsInput) {
    let baseQuery = this.repository
      .createQueryBuilder('returns')
      .innerJoinAndSelect('returns.loan', 'loan');

    baseQuery = this.buildExtraJoins({ query: baseQuery, input });
    baseQuery = this.buildWhereConditions({ query: baseQuery, input });

    return baseQuery.addOrderBy('returns.id');
  }

  private buildExtraJoins({ input, query }: BuildPaginateParams) {
    const copyQuery = query;

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
