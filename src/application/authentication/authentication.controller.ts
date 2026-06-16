import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthLibrarianUseCase,
  AuthTenantUseCase,
  AuthAdminUseCase,
} from './usecases';
import { LoginInput } from './dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authLibrarianUseCase: AuthLibrarianUseCase,
    private readonly authTenantUseCase: AuthTenantUseCase,
    private readonly authAdminUseCase: AuthAdminUseCase,
  ) {}

  @Post('librarian')
  @ApiOperation({ summary: 'Sign in with librarian account' })
  librarianLogin(@Body() input: LoginInput) {
    return this.authLibrarianUseCase.perform(input);
  }

  @Post('tenant')
  @ApiOperation({ summary: 'Sign in with tenant account' })
  tenantLogin(@Body() input: LoginInput) {
    return this.authTenantUseCase.perform(input);
  }

  @Post('admin')
  @ApiOperation({ summary: 'Sign in with admin account' })
  adminLogin(@Body() input: LoginInput) {
    return this.authAdminUseCase.perform(input);
  }
}
