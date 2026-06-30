import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common';

import { JwtGuard, LibrarianGuard } from '@/infra/guards';
import { CreateAuthorUseCase, ListAuthorsUseCase } from './usecases';
import { CreateAuthorInput, ListPaginatedAuthorsInput } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('author')
@Controller('authors')
export class AuthorsController {
  constructor(
    private readonly createAuthorUsecase: CreateAuthorUseCase,
    private readonly listPaginatedAuthorsUseCase: ListAuthorsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar autor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Nome' },
      },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          name: 'Clarice Lispector',
        },
      },
      invalid: {
        summary: 'Campo faltante',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 201,
    content: {
      'application/json': {
        example: {
          authorId: 'a0000000-0000-4000-a000-000000000001',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        example: {
          message: 'The name cannot be empty.',
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
          librarianAccess: {
            summary: 'Somente bibliotecarios tem acesso a funcionalidade',
            value: {
              message: 'Librarian access is required.',
            },
          },
        },
      },
    },
  })
  create(@Body() input: CreateAuthorInput) {
    return this.createAuthorUsecase.perform(input);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar autores' })
  @ApiQuery({
    type: 'string',
    name: 'page',
    required: false,
  })
  @ApiQuery({
    type: 'string',
    name: 'pageSize',
    required: false,
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Listando autores',
            value: {
              page: 1,
              records: 1,
              items: [
                {
                  id: 'a0000000-0000-4000-a000-000000000001',
                  name: 'J.K. Rowling',
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
        },
      },
    },
  })
  list(@Query() input: ListPaginatedAuthorsInput) {
    return this.listPaginatedAuthorsUseCase.perform(input);
  }
}
