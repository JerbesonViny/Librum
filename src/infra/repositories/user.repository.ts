import { Inject, Injectable } from '@nestjs/common';
import {
  GetUserByEmail,
  GetUserByEmailInput,
} from '@/domain/contracts/repositories';
import { LibrarianEntity, TenantEntity, UserRoles } from '@/domain/entities';
import { MONGO_DB } from '@/infra/database/database.module';
import { Db, ObjectId } from 'mongodb';
import { PersistenceUserRoleError } from '@/shared';

type UserPersistence = {
  _id: ObjectId;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
  birthDate?: string;
};

type TenantPersistence = UserPersistence & { birthDate: string };

type UserEntities = TenantEntity | LibrarianEntity;

@Injectable()
export class UserRepository implements GetUserByEmail<UserEntities> {
  private readonly collectionName = 'users';

  constructor(
    @Inject(MONGO_DB)
    private readonly db: Db,
  ) {}

  async getUserByEmail(
    input: GetUserByEmailInput,
  ): Promise<UserEntities | null> {
    const query = this.buildGetUserByEmailQuery(input);
    const user = await this.db
      .collection(this.collectionName)
      .findOne<UserPersistence>(query);

    if (!user) {
      return null;
    }

    if (!user.role) {
      throw new PersistenceUserRoleError();
    }

    return this.userFactory(user);
  }

  private buildGetUserByEmailQuery({ email, ...input }: GetUserByEmailInput) {
    const query: Record<string, any> = { email };

    if (input.role) {
      query.role = input.role;
    }

    return query;
  }

  private userFactory(user: UserPersistence): UserEntities {
    const factoryByRole = {
      LIBRARIAN: (data: UserPersistence) => new LibrarianEntity(data),
      TENANT: (data: UserPersistence) =>
        new TenantEntity(data as TenantPersistence),
    };

    return factoryByRole[user.role](user);
  }
}
