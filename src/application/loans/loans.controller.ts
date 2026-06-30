import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { JwtGuard, LibrarianOrAdminGuard, TenantGuard } from '@/infra/guards';
import { CurrentUserId } from '@/infra/decorators';
import {
  CreateLoanUseCase,
  ListLoansByUserUseCase,
  ListLoansUseCase,
} from './usecases';
import { CreateLoanInput, ListLoansInput } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('loans')
@Controller('loans')
export class LoansController {
  constructor(
    private readonly createLoanUsecase: CreateLoanUseCase,
    private readonly listLoansByUserUsecase: ListLoansByUserUseCase,
    private readonly listLoansUsecase: ListLoansUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer emprestimo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bookId: { type: 'string', title: 'ID do livro a ser emprestado' },
      },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          bookId: 'a0000000-0000-4000-a000-000000000004',
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
            summary: 'Emprestimo feito com sucesso',
            value: {
              loanId: 'a0000000-0000-4000-a000-000000000001',
            },
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
            summary: 'Usuario nao encontrado',
            value: {
              message: 'User not found.',
            },
          },
          bookNotFound: {
            summary: 'Livro nao encontrado',
            value: {
              message: 'Book not found.',
            },
          },
          bookAlreadyOnLoan: {
            summary: 'Livro emprestado',
            value: {
              message: 'This Book is already on loan.',
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
  async create(
    @CurrentUserId() userId: string,
    @Body() input: CreateLoanInput,
  ) {
    return this.createLoanUsecase.perform({ ...input, userId });
  }

  @Get('me')
  @UseGuards(JwtGuard, TenantGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar meus emprestimos' })
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
            summary: 'Meus emprestimos',
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
  async me(@CurrentUserId() userId: string, @Query() input: ListLoansInput) {
    return this.listLoansByUserUsecase.perform({ ...input, userId });
  }

  @Get()
  @UseGuards(JwtGuard, LibrarianOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar emprestimos' })
  @ApiQuery({
    name: 'page',
    type: 'string',
    nullable: true,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'string',
    nullable: true,
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Emprestimos',
            value: {
              page: 1,
              records: 1,
              items: [
                {
                  id: 'a0000000-0000-4000-a000-000000000001',
                  book: {
                    id: 'a0000000-0000-4000-a000-000000000002',
                    title: 'Harry Potter e a Pedra filosofal',
                    description: 'livro do harry potter',
                    releaseDate: '19970502',
                    createdAt: '2020-01-01T04:00:00.000Z',
                  },
                  user: {
                    id: 'a0000000-0000-4000-a000-000000000002',
                    name: 'mockedTenantName',
                    lastName: 'mockedTenantLastName',
                    email: 'mockedTenantEmail',
                    createdAt: '2020-01-02T04:00:00.000Z',
                  },
                  returns: null,
                  dueDate: '2020-01-16T11:00:00.000Z',
                  createdAt: '2020-01-01T11:00:00.000Z',
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
            summary:
              'Somente bibliotecarios ou admins possuem acesso a funcionalidade',
            value: {
              message: 'Librarian or Admin access is required',
            },
          },
        },
      },
    },
  })
  async list(@Query() input: ListLoansInput) {
    return this.listLoansUsecase.perform(input);
  }
}
