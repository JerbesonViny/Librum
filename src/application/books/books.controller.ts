import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { CreateBookInput } from './dto';
import { CreateBookUseCase } from './usecases/create-book.usecase';
import { JwtGuard, LibrarianGuard } from '@/infra/guards';

@Controller('books')
export class BooksController {
  constructor(private readonly createBookUsecase: CreateBookUseCase) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  create(@Body() input: CreateBookInput) {
    return this.createBookUsecase.perform(input);
  }
}
