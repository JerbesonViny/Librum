import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AdminOrmEntity,
  LibrarianOrmEntity,
  TenantOrmEntity,
  UserOrmEntity,
} from '@/infra/database/typeorm';
import { USER_REPOSITORY } from '@/domain/contracts/repositories';
import { UserRepository } from '@/infra/repositories/user.repository';
import { SignUpController } from './sign-up.controller';
import { SignUpLibrarianUseCase, SignUpTenantUseCase } from './usecases';

const UserRepositoryFactory = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      LibrarianOrmEntity,
      TenantOrmEntity,
      AdminOrmEntity,
    ]),
  ],
  controllers: [SignUpController],
  providers: [
    // Use cases
    SignUpLibrarianUseCase,
    SignUpTenantUseCase,

    // Repositories
    UserRepositoryFactory,
  ],
  exports: [UserRepositoryFactory],
})
export class SignUpModule {}
