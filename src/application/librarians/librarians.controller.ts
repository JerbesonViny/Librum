import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';
import { JwtGuard, AdminGuard } from '@/infra/guards';
import {
  ApproveLibrarianAccessUseCase,
  DeactivateLibrarianAccessUseCase,
} from './usecases';
import { ApproveLibrarianAccess } from './dto';

@Injectable()
@Controller('librarian')
export class LibrariansController {
  constructor(
    private readonly approveLibrarianAccessUseCase: ApproveLibrarianAccessUseCase,
    private readonly deactivateLibrarianAccessUseCase: DeactivateLibrarianAccessUseCase,
  ) {}

  @Post('approve')
  @UseGuards(JwtGuard, AdminGuard)
  async approve(@Body() input: ApproveLibrarianAccess) {
    return this.approveLibrarianAccessUseCase.perform(input);
  }

  @Post('deactivate')
  @UseGuards(JwtGuard, AdminGuard)
  async deactivate(@Body() input: ApproveLibrarianAccess) {
    return this.deactivateLibrarianAccessUseCase.perform(input);
  }
}
