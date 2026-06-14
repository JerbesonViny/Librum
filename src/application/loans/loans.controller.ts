import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { JwtGuard, TenantGuard } from '@/infra/guards';
import { CreateLoanUseCase } from './usecases';
import { CreateLoanInput } from './dto';

@Controller('loan')
export class LoansController {
  constructor(private readonly createLoanUsecase: CreateLoanUseCase) {}

  @Post()
  @UseGuards(JwtGuard, TenantGuard)
  create(@Body() input: CreateLoanInput) {
    return this.createLoanUsecase.perform(input);
  }
}
