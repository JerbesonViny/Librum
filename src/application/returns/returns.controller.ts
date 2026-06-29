import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';

import { JwtGuard, LibrarianGuard } from '@/infra/guards';
import { CreateReturnsUseCase } from './usecases';
import { CreateReturnsInput } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Injectable()
@ApiTags('returns')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly createReturnsUseCase: CreateReturnsUseCase) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar devolucao de livro' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { loanId: { type: 'string', title: 'ID do emprestimo' } },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          loanId: 'a0000000-0000-4000-a000-000000000001',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        examples: {
          loanNotFound: {
            summary: 'Emprestimo nao existente',
            value: {
              message: 'Loan not found.',
            },
          },
          bookAlreadyReturned: {
            summary: 'Livro devolvido',
            value: {
              message: 'This book has already been returned.',
            },
          },
          emptyField: {
            summary: 'Campo nao preenchido',
            value: {
              message: 'The loanId cannot be empty..',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    content: {
      'application/json': {
        examples: {
          missingToken: {
            summary: 'Token nao fornecido',
            value: {
              message: 'Token is required.',
            },
          },
          invalidToken: {
            summary: 'Token nao valido',
            value: {
              message: 'Invalid token.',
            },
          },
          tenantAccess: {
            summary: 'Somente bibliotecarios tem acesso',
            value: {
              message: 'Librarian access is required.',
            },
          },
        },
      },
    },
  })
  async create(@Body() input: CreateReturnsInput) {
    return this.createReturnsUseCase.perform(input);
  }
}
