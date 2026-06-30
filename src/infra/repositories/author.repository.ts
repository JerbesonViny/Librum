import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Create,
  FindManyAuthors,
  FindManyAuthorsInput,
  PaginatedAuthors,
  PaginatedAuthorsInput,
  PaginatedOutput,
} from '@/domain/contracts/repositories';
import { AuthorEntity, EntityId } from '@/domain/entities';
import { AuthorOrmEntity } from '@/infra/database/typeorm';

@Injectable()
export class AuthorRepository
  implements Create<AuthorEntity, EntityId>, FindManyAuthors, PaginatedAuthors
{
  constructor(
    @InjectRepository(AuthorOrmEntity)
    private readonly repository: Repository<AuthorOrmEntity>,
  ) {}

  async create(entity: AuthorEntity): Promise<EntityId | null> {
    const author = this.repository.create({
      ...entity,
      id: entity.getId().toString(),
    });

    try {
      await this.repository.insert(author);
    } catch (error) {
      console.log(error);
      return null;
    }

    return entity.getId();
  }

  async findMany(input: FindManyAuthorsInput): Promise<AuthorEntity[] | null> {
    if (!Object.keys(input)?.length || !input.authorIds?.length) {
      return null;
    }

    const query = this.repository
      .createQueryBuilder('author')
      .where('author.id IN (:...ids)', { ids: input.authorIds });

    const authors = await query.getMany();

    if (!authors) {
      return null;
    }

    return authors.map((author) => author.toDomain());
  }

  async paginate({
    page,
    pageSize,
  }: PaginatedAuthorsInput): Promise<PaginatedOutput<AuthorEntity> | null> {
    const __page = !page || Number(page) <= 0 ? 1 : Number(page);
    const __pageSize = pageSize || 10;
    const __skip = __pageSize * (__page - 1);

    try {
      const [authors, records] = await this.repository.findAndCount({
        skip: __skip,
        take: __pageSize,
      });

      return {
        page: __page,
        records,
        items: authors.map((author) => author.toDomain()),
      };
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
