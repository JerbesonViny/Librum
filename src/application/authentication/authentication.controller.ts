import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLibrarianUseCase } from './usecases';
import { LibrarianLoginInput } from './dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authLibrarianUseCase: AuthLibrarianUseCase) {}

  @Post('librarian')
  @ApiOperation({ summary: 'Sign in with librarian account' })
  librarianLogin(@Body() input: LibrarianLoginInput) {
    return this.authLibrarianUseCase.perform(input);
  }
}
