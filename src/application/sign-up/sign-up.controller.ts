import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SignUpLibrarianUseCase, SignUpTenantUseCase } from './usecases';
import { SignUpLibrarian, SignUpTenant } from './dto';

@ApiTags('sign-up')
@Controller('sign-up')
export class SignUpController {
  constructor(
    private readonly signUpLibrarianUseCase: SignUpLibrarianUseCase,
    private readonly signUpTenantUseCase: SignUpTenantUseCase,
  ) {}

  @Post('librarian')
  @ApiOperation({ summary: 'Sign up with librarian account' })
  librarianSignUp(@Body() input: SignUpLibrarian) {
    return this.signUpLibrarianUseCase.perform(input);
  }

  @Post('tenant')
  @ApiOperation({ summary: 'Sign up with tenant account' })
  tenantSignUp(@Body() input: SignUpTenant) {
    return this.signUpTenantUseCase.perform(input);
  }
}
