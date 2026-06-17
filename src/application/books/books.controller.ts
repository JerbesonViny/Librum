import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { JwtGuard, LibrarianGuard } from '@/infra/guards';
import { CreateBookUseCase, ListBooksUseCase } from './usecases';
import { CreateBookInput, ListBooksInput } from './dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly createBookUsecase: CreateBookUseCase,
    private readonly listBooksUseCase: ListBooksUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  create(@Body() input: CreateBookInput) {
    return this.createBookUsecase.perform(input);
  }

  @Get()
  list(@Query() input: ListBooksInput) {
    return this.listBooksUseCase.perform(input);
  }
}
