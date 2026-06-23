import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard, AdminGuard } from '@/infra/guards';
import {
  ApproveLibrarianAccessUseCase,
  DeactivateLibrarianAccessUseCase,
  ListLibrariansUseCase,
} from './usecases';
import { ApproveLibrarianAccess, ListPaginatedLibrarians } from './dto';

@Injectable()
@Controller('librarians')
export class LibrariansController {
  constructor(
    private readonly approveLibrarianAccessUseCase: ApproveLibrarianAccessUseCase,
    private readonly deactivateLibrarianAccessUseCase: DeactivateLibrarianAccessUseCase,
    private readonly listLibrariansUseCase: ListLibrariansUseCase,
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

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  async listLibrarians(@Query() input: ListPaginatedLibrarians) {
    return this.listLibrariansUseCase.perform(input);
  }
}
