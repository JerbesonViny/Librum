import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { JwtGuard, LibrarianGuard, TenantGuard } from '@/infra/guards';
import { CurrentUserId } from '@/infra/decorators';
import {
  CreateLoanUseCase,
  ListLoansByUserUseCase,
  ListLoansUseCase,
} from './usecases';
import { CreateLoanInput, ListLoansInput } from './dto';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly createLoanUsecase: CreateLoanUseCase,
    private readonly listLoansByUserUsecase: ListLoansByUserUseCase,
    private readonly listLoansUsecase: ListLoansUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard, TenantGuard)
  async create(@Body() input: CreateLoanInput) {
    return this.createLoanUsecase.perform(input);
  }

  @Get('me')
  @UseGuards(JwtGuard, TenantGuard)
  async me(@CurrentUserId() userId: string, @Body() input: ListLoansInput) {
    return this.listLoansByUserUsecase.perform({ ...input, userId });
  }

  @Get()
  @UseGuards(JwtGuard, LibrarianGuard)
  async list(@Query() input: ListLoansInput) {
    return this.listLoansUsecase.perform(input);
  }
}
