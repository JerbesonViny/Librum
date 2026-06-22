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
  PendingApprovesUseCase,
  DisabledLibrariansUseCase,
  ApprovedLibrariansUseCase,
} from './usecases';
import { ApproveLibrarianAccess, ListPaginatedLibrarians } from './dto';

@Injectable()
@Controller('librarian')
export class LibrariansController {
  constructor(
    private readonly approveLibrarianAccessUseCase: ApproveLibrarianAccessUseCase,
    private readonly deactivateLibrarianAccessUseCase: DeactivateLibrarianAccessUseCase,
    private readonly pendingApprovesUseCase: PendingApprovesUseCase,
    private readonly disabledLibrariansUseCase: DisabledLibrariansUseCase,
    private readonly approvedLibrariansUseCase: ApprovedLibrariansUseCase,
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

  @Get('pending')
  @UseGuards(JwtGuard, AdminGuard)
  async pendingApprove(@Query() input: ListPaginatedLibrarians) {
    return this.pendingApprovesUseCase.perform(input);
  }

  @Get('disabled')
  @UseGuards(JwtGuard, AdminGuard)
  async disabledLibrarians(@Query() input: ListPaginatedLibrarians) {
    return this.disabledLibrariansUseCase.perform(input);
  }

  @Get('approved')
  @UseGuards(JwtGuard, AdminGuard)
  async approvedLibrarians(@Query() input: ListPaginatedLibrarians) {
    return this.approvedLibrariansUseCase.perform(input);
  }
}
