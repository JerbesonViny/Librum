import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { winstonConfig } from '@/infra/logger/logger.config';
import { WelcomeModule } from '@/application/welcome/welcome.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot(winstonConfig),
    WelcomeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
