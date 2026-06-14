import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import configuration from '@/infra/environments/environments.config';
import { winstonConfig } from '@/infra/logger/logger.config';

import { DatabaseModule } from '@/infra/database/database.module';
import { AuthenticationModule } from '@/application/authentication/authentication.module';
import { BooksModule } from '@/application/books/books.module';
import { LoansModule } from '@/application/loans/loans.module';
import { ReturnsModule } from '@/application/returns/returns.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    WinstonModule.forRoot(winstonConfig),
    DatabaseModule,
    AuthenticationModule,
    BooksModule,
    LoansModule,
    ReturnsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
