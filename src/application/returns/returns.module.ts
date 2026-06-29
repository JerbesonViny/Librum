import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReturnsLoanOrmEntity } from '@/infra/database/typeorm';
import { RETURNS_REPOSITORY } from '@/domain/contracts/repositories';
import { ReturnsRepository } from '@/infra/repositories';
import { ReturnsController } from './returns.controller';
import { CreateReturnsUseCase, ListReturnsByUserUseCase } from './usecases';
import { LoansModule } from '@/application/loans/loans.module';
import { AuthenticationModule } from '@/application/authentication/authentication.module';

const ReturnsRepositoryFactory = {
  provide: RETURNS_REPOSITORY,
  useClass: ReturnsRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([ReturnsLoanOrmEntity]),
    LoansModule,
    AuthenticationModule,
  ],
  controllers: [ReturnsController],
  providers: [
    // Usecases
    CreateReturnsUseCase,
    ListReturnsByUserUseCase,

    // Repositories
    ReturnsRepositoryFactory,
  ],
  exports: [ReturnsRepositoryFactory],
})
export class ReturnsModule {}
