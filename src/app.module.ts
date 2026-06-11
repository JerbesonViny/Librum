import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { winstonConfig } from '@/infra/logger/logger.config';
import configuration from '@/infra/environments/environments.config';
import { AuthenticationModule } from '@/application/authentication/authentication.module';
import { DatabaseModule } from '@/infra/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    WinstonModule.forRoot(winstonConfig),
    DatabaseModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
