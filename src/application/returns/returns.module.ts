import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReturnsLoanOrmEntity } from '@/infra/database/typeorm';
import { RETURNS_REPOSITORY } from '@/domain/contracts/repositories';
import { ReturnsRepository } from '@/infra/repositories';
import { ReturnsController } from './returns.controller';
import { CreateReturnsUseCase } from './usecases';
import { LoansModule } from '../loans/loans.module';

const ReturnsRepositoryFactory = {
  provide: RETURNS_REPOSITORY,
  useClass: ReturnsRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ReturnsLoanOrmEntity]), LoansModule],
  controllers: [ReturnsController],
  providers: [
    // Usecases
    CreateReturnsUseCase,

    // Repositories
    ReturnsRepositoryFactory,
  ],
  exports: [ReturnsRepositoryFactory],
})
export class ReturnsModule {}
