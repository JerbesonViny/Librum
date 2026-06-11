import { Inject, Injectable } from '@nestjs/common';
import { GetUserByEmail } from '@/domain/contracts/repositories';
import { UserEntity } from '@/domain/entities';
import { MONGO_DB } from '../database/database.module';
import { Db } from 'mongodb';

@Injectable()
export class UserRepository implements GetUserByEmail<UserEntity> {
  private readonly collectionName = 'users';

  constructor(
    @Inject(MONGO_DB)
    private readonly db: Db,
  ) {}

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.db
      .collection(this.collectionName)
      .findOne({ email });

    if (!user) {
      return null;
    }

    return new UserEntity({
      id: user._id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    });
  }
}
