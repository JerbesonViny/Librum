import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard, LibrarianGuard, TenantGuard } from '@/infra/guards';
import { CreateReturnsUseCase, ListReturnsByUserUseCase } from './usecases';
import { CreateReturnsInput, ListReturnsInput } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '@/infra/decorators';

@Injectable()
@ApiTags('returns')
@Controller('returns')
export class ReturnsController {
  constructor(
    private readonly createReturnsUseCase: CreateReturnsUseCase,
    private readonly listReturnsByUserUseCase: ListReturnsByUserUseCase,
  ) {}

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

  @Get('me')
  @UseGuards(JwtGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar minhas devolucoes' })
  @ApiQuery({
    name: 'page',
    type: 'string',
    nullable: true,
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'string',
    nullable: true,
    required: false,
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Minhas devolucoes',
            value: {
              page: 1,
              records: 1,
              items: [
                {
                  id: 'dd10822f-df82-4550-84ee-d58d69acb6c0',
                  book: {
                    id: 'a0000000-0000-4000-a000-000000000004',
                    title: 'Harry Potter e o Prisioneiro de Azkaban',
                    description: 'livro do harry potter',
                    releaseDate: '19990502',
                    createdAt: '2020-01-01T04:00:00.000Z',
                  },
                  dueDate: '2026-07-14T02:07:13.898Z',
                  createdAt: '2026-06-29T02:07:13.899Z',
                },
              ],
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
            summary: 'Somente locatario tem acesso',
            value: {
              message: 'Tenant access is required.',
            },
          },
        },
      },
    },
  })
  async me(@CurrentUserId() userId: string, @Query() input: ListReturnsInput) {
    return this.listReturnsByUserUseCase.perform({ ...input, userId });
  }
}
