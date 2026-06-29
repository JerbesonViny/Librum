import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AUTHOR_REPOSITORY } from '@/domain/contracts/repositories';
import { AuthorRepository } from '@/infra/repositories';
import { AuthorOrmEntity } from '@/infra/database/typeorm';
import { CreateAuthorUseCase } from './usecases';
import { AuthorsController } from './authors.controller';
import { AuthenticationModule } from '@/application/authentication/authentication.module';

const AuthorRepositoryFactory = {
  provide: AUTHOR_REPOSITORY,
  useClass: AuthorRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([AuthorOrmEntity]), AuthenticationModule],
  controllers: [AuthorsController],
  providers: [
    // Usecases
    CreateAuthorUseCase,

    // Repositories
    AuthorRepositoryFactory,
  ],
  exports: [
    AuthorRepositoryFactory,
    TypeOrmModule.forFeature([AuthorOrmEntity]),
  ],
})
export class AuthorsModule {}
