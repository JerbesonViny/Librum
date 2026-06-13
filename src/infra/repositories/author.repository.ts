import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Create,
  FindManyAuthors,
  FindManyAuthorsInput,
} from '@/domain/contracts/repositories';
import { AuthorEntity, EntityId } from '@/domain/entities';
import { AuthorOrmEntity } from '@/infra/database/typeorm';

@Injectable()
export class AuthorRepository
  implements Create<AuthorEntity, EntityId>, FindManyAuthors
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
    if (!Object.keys(input)?.length) {
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
}
