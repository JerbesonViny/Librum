import { Module } from '@nestjs/common';

import { WelcomeController } from '@/application/welcome/welcome.controller';

@Module({
  imports: [],
  controllers: [WelcomeController],
  providers: [],
  exports: [],
})
export class WelcomeModule {}
