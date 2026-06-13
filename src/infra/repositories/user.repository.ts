import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  GetUserByEmail,
  GetUserByEmailInput,
} from '@/domain/contracts/repositories';
import { LibrarianEntity, TenantEntity } from '@/domain/entities';
import { UserOrmEntity } from '@/infra/database/typeorm';

type UserEntities = TenantEntity | LibrarianEntity;

@Injectable()
export class UserRepository implements GetUserByEmail<UserEntities> {
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

    if (role) {
      if (role == 'TENANT') {
        baseQuery = baseQuery.innerJoinAndSelect('user.tenant', 'tenant');
      } else if (role == 'LIBRARIAN') {
        baseQuery = baseQuery.innerJoinAndSelect('user.librarian', 'librarian');
      }
    } else {
      baseQuery = baseQuery
        .leftJoinAndSelect('user.tenant', 'tenant')
        .leftJoinAndSelect('user.librarian', 'librarian');
    }

    return baseQuery.where('user.email = :email', { email: email }).select();
  }
}
