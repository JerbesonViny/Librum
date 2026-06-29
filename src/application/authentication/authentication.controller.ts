import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Logar como bibliotecario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', title: 'Email' },
        password: { type: 'string', title: 'Senha' },
      },
    },
    examples: {
      valid: {
        summary: 'Credenciais validas',
        value: {
          email: 'mockedLibrarianEmail',
          password: 'mockedPassword',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Retorna um JWT',
            value: { token: 'jwt-token' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'Usuario nao cadastrado',
            value: { message: 'User not found.' },
          },
          wrongPassword: {
            summary: 'Senha incorreta',
            value: { message: 'Wrong password.' },
          },
        },
      },
    },
  })
  librarianLogin(@Body() input: LoginInput) {
    return this.authLibrarianUseCase.perform(input);
  }

  @Post('tenant')
  @ApiOperation({ summary: 'Logar como locatario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', title: 'Email' },
        password: { type: 'string', title: 'Senha' },
      },
    },
    examples: {
      valid: {
        summary: 'Credenciais validas',
        value: {
          email: 'mockedTenantEmail',
          password: 'mockedPassword',
        },
      },
      wrongPassword: {
        summary: 'Senha errada',
        value: {
          email: 'mockedTenantEmail',
          password: 'wrongPassword',
        },
      },
      userNotFound: {
        summary: 'Usuario nao encontrado',
        value: {
          email: 'notFoundEmail',
          password: 'notFoundPassword',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Retorna um JWT',
            value: { token: 'jwt-token' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'Usuario nao cadastrado',
            value: { message: 'User not found.' },
          },
          wrongPassword: {
            summary: 'Senha incorreta',
            value: { message: 'Wrong password.' },
          },
        },
      },
    },
  })
  tenantLogin(@Body() input: LoginInput) {
    return this.authTenantUseCase.perform(input);
  }

  @Post('admin')
  @ApiOperation({ summary: 'Logar como admin' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', title: 'Email' },
        password: { type: 'string', title: 'Senha' },
      },
    },
    examples: {
      valid: {
        summary: 'Credenciais validas',
        value: {
          email: 'mockedAdminEmail',
          password: 'mockedAdminPassword',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Retorna um JWT',
            value: { token: 'jwt-token' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'Usuario nao cadastrado',
            value: { message: 'User not found.' },
          },
          wrongPassword: {
            summary: 'Senha incorreta',
            value: { message: 'Wrong password.' },
          },
        },
      },
    },
  })
  adminLogin(@Body() input: LoginInput) {
    return this.authAdminUseCase.perform(input);
  }
}
