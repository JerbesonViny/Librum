import { Module } from '@nestjs/common';

import { AuthenticationController } from './authentication.controller';
import { AuthLibrarianUseCase, AuthTenantUseCase } from './usecases';
import { USER_REPOSITORY } from '@/domain/contracts/repositories';
import { UserRepository } from '@/infra/repositories/user.repository';

const UserRepositoryFactory = {
  provide: USER_REPOSITORY,
  useClass: UserRepository,
};

@Module({
  imports: [],
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
