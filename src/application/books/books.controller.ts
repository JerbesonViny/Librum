import { Controller, Post, Body } from '@nestjs/common';

import { CreateBookInput } from './dto';
import { CreateBookUsecase } from './usecases/create-book.usecase';

@Controller('books')
export class BooksController {
  constructor(private readonly createBookUsecase: CreateBookUsecase) {}

  @Post()
  create(@Body() input: CreateBookInput) {
    return this.createBookUsecase.perform(input);
  }
}
