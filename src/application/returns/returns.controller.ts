import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';

import { JwtGuard, LibrarianGuard } from '@/infra/guards';
import { CreateReturnsUseCase } from './usecases';
import { CreateReturnsInput } from './dto';

@Injectable()
@Controller('returns')
export class ReturnsController {
  constructor(private readonly createReturnsUseCase: CreateReturnsUseCase) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  async create(@Body() input: CreateReturnsInput) {
    return this.createReturnsUseCase.perform(input);
  }
}
