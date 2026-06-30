import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Criar uma conta de bibliotecario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', title: 'Email' },
        password: { type: 'string', title: 'Senha' },
        name: { type: 'string', title: 'Nome' },
        lastName: { type: 'string', title: 'Sobrenome' },
      },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          email: 'kerginaldo@exemplo.com',
          password: '12345',
          name: 'Kerginaldo',
          lastName: 'Odlanigrek',
        },
      },
      invalidPassword: {
        summary: 'Senha invalida',
        value: {
          email: 'kerginaldo@exemplo.com',
          password: '123',
          name: 'Kerginaldo',
          lastName: 'Odlanigrek',
        },
      },
      emptyField: {
        summary: 'Campo faltante',
        value: {
          email: 'kerginaldo@exemplo.com',
          password: '12345',
          name: 'Kerginaldo',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Bibliotecario criado com sucesso',
            value: { librarianId: 'a0000000-0000-4000-a000-000000000002' },
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
          emailAlreadyUsed: {
            summary: 'Email em uso',
            value: { message: 'This email is already used.' },
          },
          invalidInput: {
            summary: 'Nome obrigatorio',
            value: { message: 'The name cannot be empty.' },
          },
          invalidPassword: {
            summary: 'Tamanho minimo de senha nao atingido',
            value: {
              message:
                'Invalid password. Password must contain a minimum of 5 characters.',
            },
          },
        },
      },
    },
  })
  librarianSignUp(@Body() input: SignUpLibrarian) {
    return this.signUpLibrarianUseCase.perform(input);
  }

  @Post('tenant')
  @ApiOperation({ summary: 'Criar uma conta de locatario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', title: 'Email' },
        password: { type: 'string', title: 'Senha' },
        name: { type: 'string', title: 'Nome' },
        lastName: { type: 'string', title: 'Sobrenome' },
        birthDate: { type: 'string', title: 'Data de nascimento' },
      },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          email: 'cesar@exemplo.com',
          password: '12345',
          name: 'Cesar',
          lastName: 'Rasec',
          birthDate: '20020101',
        },
      },
      invalidPassword: {
        summary: 'Senha invalida',
        value: {
          email: 'cesar@exemplo.com',
          password: '123',
          name: 'Cesar',
          lastName: 'Rasec',
          birthDate: '20020101',
        },
      },
      emptyField: {
        summary: 'Campo faltante',
        value: {
          email: 'cesar@exemplo.com',
          password: '12345',
          name: 'Cesar',
          lastName: 'Rasec',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Locatario criado com sucesso',
            value: { tenantId: 'a0000000-0000-4000-a000-000000000002' },
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
          emailAlreadyUsed: {
            summary: 'Email em uso',
            value: { message: 'This email is already used.' },
          },
          invalidInput: {
            summary: 'Data de nascimento obrigatorio',
            value: { message: 'The birthDate cannot be empty.' },
          },
          invalidPassword: {
            summary: 'Tamanho minimo de senha nao atingido',
            value: {
              message:
                'Invalid password. Password must contain a minimum of 5 characters.',
            },
          },
        },
      },
    },
  })
  tenantSignUp(@Body() input: SignUpTenant) {
    return this.signUpTenantUseCase.perform(input);
  }
}
