import { Inject, Injectable } from '@nestjs/common';
import { Create } from '@/domain/contracts/repositories';
import { BookEntity, EntityId } from '@/domain/entities';
import { MONGO_DB } from '@/infra/database/database.module';
import { Db } from 'mongodb';

@Injectable()
export class BookRepository implements Create<BookEntity, EntityId> {
  private readonly collectionName = 'books';

  constructor(
    @Inject(MONGO_DB)
    private readonly db: Db,
  ) {}

  async create(entity: BookEntity): Promise<EntityId | null> {
    const result = await this.db.collection(this.collectionName).insertOne({
      ...entity,
      createdAt: new Date(),
    });

    if (!result.acknowledged) {
      return null;
    }

    return result.insertedId;
  }
}
