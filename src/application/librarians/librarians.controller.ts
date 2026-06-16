import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';
import { ApproveLibrarianAccessUseCase } from './usecases';
import { ApproveLibrarianAccess } from './dto';
import { JwtGuard, AdminGuard } from '@/infra/guards';

@Injectable()
@Controller('librarian')
export class LibrariansController {
  constructor(
    private readonly approveLibrarianAccessUseCase: ApproveLibrarianAccessUseCase,
  ) {}

  @Post('approve')
  @UseGuards(JwtGuard, AdminGuard)
  async approve(@Body() input: ApproveLibrarianAccess) {
    return this.approveLibrarianAccessUseCase.perform(input);
  }
}
