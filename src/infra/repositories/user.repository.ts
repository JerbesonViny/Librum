import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import {
  FindOneUser,
  FindOneUserInput,
  GetUserByEmail,
  GetUserByEmailInput,
} from '@/domain/contracts/repositories';
import { LibrarianEntity, TenantEntity, UserRoles } from '@/domain/entities';
import { UserOrmEntity } from '@/infra/database/typeorm';

type UserEntities = TenantEntity | LibrarianEntity;

type GetJoin = {
  baseQuery: SelectQueryBuilder<UserOrmEntity>;
  role?: UserRoles;
};

@Injectable()
export class UserRepository
  implements GetUserByEmail<UserEntities>, FindOneUser
{
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async getUserByEmail(
    input: GetUserByEmailInput,
  ): Promise<UserEntities | null> {
    const query = this.buildGetUserByEmailQuery(input);

    const user = await query.getOne();

    if (!user) {
      return null;
    }

    return user.toDomain();
  }

  private buildGetUserByEmailQuery({ email, role }: GetUserByEmailInput) {
    let baseQuery = this.repository.createQueryBuilder('user');

    baseQuery = this.getJoin({ baseQuery, role });

    return baseQuery.where('user.email = :email', { email: email }).select();
  }

  private getJoin({ baseQuery, role }: GetJoin) {
    if (role) {
      if (role == 'TENANT') {
        return baseQuery.innerJoinAndSelect('user.tenant', 'tenant');
      } else if (role == 'LIBRARIAN') {
        return baseQuery.innerJoinAndSelect('user.librarian', 'librarian');
      }
    }

    return baseQuery
      .leftJoinAndSelect('user.tenant', 'tenant')
      .leftJoinAndSelect('user.librarian', 'librarian');
  }

  async findOne(input: FindOneUserInput): Promise<UserEntities | null> {
    if (!input.id) {
      return null;
    }

    let baseQuery = this.repository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: input.id.toString() });
    baseQuery = this.getJoin({ baseQuery, role: input.role });

    const user = await baseQuery.getOne();

    if (!user) {
      return null;
    }

    return user.toDomain();
  }
}
