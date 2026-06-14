import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { JwtGuard, LibrarianGuard } from '@/infra/guards';
import { CreateAuthorUseCase } from './usecases/create-author.usecase';
import { CreateAuthorInput } from './dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly createAuthorUsecase: CreateAuthorUseCase) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  create(@Body() input: CreateAuthorInput) {
    return this.createAuthorUsecase.perform(input);
  }
}
