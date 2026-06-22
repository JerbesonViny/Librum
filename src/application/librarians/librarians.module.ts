import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantOrmEntity, UserOrmEntity } from '@/infra/database/typeorm';
import { AuthenticationModule } from '@/application/authentication/authentication.module';
import { LibrariansController } from './librarians.controller';
import {
  ApproveLibrarianAccessUseCase,
  DeactivateLibrarianAccessUseCase,
  PendingApprovesUseCase,
  ApprovedLibrariansUseCase,
  DisabledLibrariansUseCase,
} from './usecases';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, TenantOrmEntity]),
    AuthenticationModule,
  ],
  controllers: [LibrariansController],
  providers: [
    ApproveLibrarianAccessUseCase,
    DeactivateLibrarianAccessUseCase,
    PendingApprovesUseCase,
    ApprovedLibrariansUseCase,
    DisabledLibrariansUseCase,
  ],
})
export class LibrariansModule {}
