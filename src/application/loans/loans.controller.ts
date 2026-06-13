import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@/infra/guards';
import { CreateLoanUseCase } from './usecases';
import { CreateLoanInput } from './dto';

@Controller('loan')
export class LoansController {
  constructor(private readonly createLoanUsecase: CreateLoanUseCase) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() input: CreateLoanInput) {
    return this.createLoanUsecase.perform(input);
  }
}
