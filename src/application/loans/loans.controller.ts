import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';

import { JwtGuard, TenantGuard } from '@/infra/guards';
import { CurrentUserId } from '@/infra/decorators';
import { CreateLoanUseCase, ListLoansByUserUseCase } from './usecases';
import { CreateLoanInput, ListLoansInput } from './dto';

@Controller('loan')
export class LoansController {
  constructor(
    private readonly createLoanUsecase: CreateLoanUseCase,
    private readonly listLoansByUserUsecase: ListLoansByUserUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard, TenantGuard)
  create(@Body() input: CreateLoanInput) {
    return this.createLoanUsecase.perform(input);
  }

  @Get('me')
  @UseGuards(JwtGuard, TenantGuard)
  me(@CurrentUserId() userId: string, @Body() input: ListLoansInput) {
    return this.listLoansByUserUsecase.perform({ ...input, userId });
  }
}
