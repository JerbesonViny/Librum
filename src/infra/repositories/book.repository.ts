import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import {
  Create,
  FindOneBook,
  FindOneBookInput,
  PaginatedBooks,
  PaginatedOutput,
  PaginatedBooksInput,
} from '@/domain/contracts/repositories';
import { BookEntity, EntityId } from '@/domain/entities';
import { BookOrmEntity } from '@/infra/database/typeorm';

@Injectable()
export class BookRepository
  implements Create<BookEntity, EntityId>, FindOneBook, PaginatedBooks
{
  constructor(
    @InjectRepository(BookOrmEntity)
    private readonly repository: Repository<BookOrmEntity>,
  ) {}

  async create(entity: BookEntity): Promise<EntityId | null> {
    const book = this.repository.create({
      ...entity,
      id: entity.getId().toString(),
    });

    try {
      await this.repository.insert(book);
    } catch (error) {
      console.log(error);
      return null;
    }

    return entity.getId();
  }

  async findOne(input: FindOneBookInput): Promise<BookEntity | null> {
    const query = this.repository
      .createQueryBuilder('book')
      .where('book.id = :id', { id: input.id.toString() })
      .innerJoinAndSelect('book.authors', 'authors');

    const book = await query.getOne();

    if (!book) {
      return null;
    }

    return book.toDomain();
  }

  async paginate({
    page,
    pageSize,
    search,
  }: PaginatedBooksInput): Promise<PaginatedOutput<BookEntity> | null> {
    const __page = !page || Number(page) <= 0 ? 1 : Number(page);
    const __pageSize = pageSize || 10;
    const __skip = __pageSize * (__page - 1);
    const where = search
      ? [
          {
            title: ILike(`%${search}%`),
          },
          {
            description: ILike(`%${search}%`),
          },
        ]
      : undefined;

    try {
      const [books, records] = await this.repository.findAndCount({
        relations: { authors: true },
        skip: __skip,
        take: __pageSize,
        where,
      });

      return {
        page: __page,
        records,
        items: books.map((book) => book.toDomain()),
      };
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
