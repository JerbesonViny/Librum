import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Create,
  FindOneBook,
  FindOneBookInput,
} from '@/domain/contracts/repositories';
import { BookEntity, EntityId } from '@/domain/entities';
import { BookOrmEntity } from '@/infra/database/typeorm';

@Injectable()
export class BookRepository
  implements Create<BookEntity, EntityId>, FindOneBook
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
}
