import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import {
  ApproveLibrarianAccess,
  Create,
  FindOneUser,
  FindOneUserInput,
  GetUserByEmail,
  GetUserByEmailInput,
} from '@/domain/contracts/repositories';
import {
  AdminEntity,
  EntityId,
  LibrarianEntity,
  TenantEntity,
  UserEntity,
  UserRoles,
} from '@/domain/entities';
import {
  AdminOrmEntity,
  LibrarianOrmEntity,
  TenantOrmEntity,
  UserOrmEntity,
} from '@/infra/database/typeorm';

type UserEntities = TenantEntity | LibrarianEntity | AdminEntity;

type GetJoin = {
  baseQuery: SelectQueryBuilder<UserOrmEntity>;
  role?: UserRoles;
};

@Injectable()
export class UserRepository
  implements
    GetUserByEmail<UserEntities>,
    FindOneUser,
    Create<UserEntity, EntityId>,
    ApproveLibrarianAccess
{
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    @InjectRepository(TenantOrmEntity)
    private readonly tenantRepository: Repository<TenantOrmEntity>,
    @InjectRepository(LibrarianOrmEntity)
    private readonly librarianRepository: Repository<LibrarianOrmEntity>,
    @InjectRepository(AdminOrmEntity)
    private readonly adminRepository: Repository<AdminOrmEntity>,
  ) {}

  async create(entity: UserEntity): Promise<EntityId | null> {
    const user = this.userRepository.create({
      ...entity,
      id: entity.getId().toString(),
    });

    const specializedUser = this.buildSpecializedUser(entity);
    await this.userRepository.manager
      .transaction(async (entityMananger) => {
        await entityMananger.save(user);
        await entityMananger.save(specializedUser);
      })
      .catch((err) => {
        console.log(err);
        return null;
      });

    return entity.getId();
  }

  private buildSpecializedUser(entity: UserEntity) {
    if (this.librarianGuard(entity)) {
      return this.librarianRepository.create({
        userId: entity.getId().toString(),
        approved: entity.isApproved(),
        disabled: entity.isDisabled(),
        approvedAt: entity.getApprovedAt(),
        disabledAt: entity.getDisabledAt(),
      });
    } else if (this.tenantGuard(entity)) {
      return this.tenantRepository.create({
        userId: entity.getId().toString(),
        birthDate: entity.getBirthDate(),
      });
    }

    return this.adminRepository.create({
      userId: entity.getId().toString(),
    });
  }

  private tenantGuard(entity: UserEntity): entity is TenantEntity {
    return entity.getRole() === 'TENANT';
  }

  private librarianGuard(entity: UserEntity): entity is LibrarianEntity {
    return entity.getRole() === 'LIBRARIAN';
  }

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
    let baseQuery = this.userRepository.createQueryBuilder('user');

    baseQuery = this.getJoin({ baseQuery, role });

    return baseQuery.where('user.email = :email', { email: email }).select();
  }

  private getJoin({ baseQuery, role }: GetJoin) {
    if (role) {
      if (role == 'TENANT') {
        return baseQuery.innerJoinAndSelect('user.tenant', 'tenant');
      } else if (role == 'LIBRARIAN') {
        return baseQuery.innerJoinAndSelect('user.librarian', 'librarian');
      } else {
        return baseQuery.innerJoinAndSelect('user.admin', 'admin');
      }
    }

    return baseQuery
      .leftJoinAndSelect('user.tenant', 'tenant')
      .leftJoinAndSelect('user.librarian', 'librarian')
      .leftJoinAndSelect('user.admin', 'admin');
  }

  async findOne(input: FindOneUserInput): Promise<UserEntities | null> {
    if (!input.id) {
      return null;
    }

    let baseQuery = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: input.id.toString() });
    baseQuery = this.getJoin({ baseQuery, role: input.role });

    const user = await baseQuery.getOne();

    if (!user) {
      return null;
    }

    return user.toDomain();
  }

  async approveLibrarianAccess(
    entity: LibrarianEntity,
  ): Promise<boolean | null> {
    const lib = this.librarianRepository.create({
      userId: entity.getId().toString(),
      approved: entity.isApproved(),
      disabled: entity.isDisabled(),
      approvedAt: entity.getApprovedAt(),
      disabledAt: entity.getDisabledAt(),
    });

    try {
      await this.librarianRepository
        .createQueryBuilder()
        .update(lib)
        .set({
          approved: true,
          approvedAt: entity.getApprovedAt(),
        })
        .where('user_id = :userId', { userId: entity.getId().toString() })
        .execute();
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }
}
