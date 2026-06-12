import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { CreateBookInput } from './dto';
import { CreateBookUsecase } from './usecases/create-book.usecase';
import { JwtGuard, LibrarianGuard } from '@/infra/guards';

@Controller('books')
export class BooksController {
  constructor(private readonly createBookUsecase: CreateBookUsecase) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  create(@Body() input: CreateBookInput) {
    return this.createBookUsecase.perform(input);
  }
}
