import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  LibrarianOrmEntity,
  TenantOrmEntity,
  UserOrmEntity,
} from '@/infra/database/typeorm';
import { USER_REPOSITORY } from '@/domain/contracts/repositories';
import { UserRepository } from '@/infra/repositories/user.repository';
import { AuthenticationController } from './authentication.controller';
import { AuthLibrarianUseCase, AuthTenantUseCase } from './usecases';

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
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [
    // Use cases
    AuthLibrarianUseCase,
    AuthTenantUseCase,

    // Repositories
    UserRepositoryFactory,
  ],
  exports: [],
})
export class AuthenticationModule {}
