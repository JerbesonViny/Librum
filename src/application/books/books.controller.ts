import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { JwtGuard, LibrarianGuard } from '@/infra/guards';
import { CreateBookUseCase, ListBooksUseCase } from './usecases';
import { CreateBookInput, ListBooksInput } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(
    private readonly createBookUsecase: CreateBookUseCase,
    private readonly listBooksUseCase: ListBooksUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard, LibrarianGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar livro' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Titulo' },
        description: { type: 'string', title: 'Descricao' },
        releaseDate: { type: 'string', title: 'Data de lancamento' },
        authorIds: { type: 'array', title: 'IDs dos autores' },
      },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          title: 'Neuromancer',
          description: 'Cyberpunk',
          releaseDate: '19840101',
          authorIds: ['a0000000-0000-4000-a000-000000000002'],
        },
      },
      authorNotFound: {
        summary: 'Autor inexistente',
        value: {
          title: 'Count Zero',
          description: 'Cyberpunk',
          releaseDate: '19860101',
          authorIds: ['a0000000-0000-4000-a000-000000000009'],
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
            summary: 'Livro criado com sucesso',
            value: {
              bookId: 'a0000000-0000-4000-a000-000000000002',
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
          authorNotFound: {
            summary: 'Autores nao encontrados',
            value: {
              message: 'Author not found.',
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
  create(@Body() input: CreateBookInput) {
    return this.createBookUsecase.perform(input);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar livros' })
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
  @ApiQuery({
    type: 'string',
    name: 'search',
    required: false,
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          success: {
            summary: 'Listando livros',
            value: {
              page: 1,
              records: 2,
              items: [
                {
                  id: 'a0000000-0000-4000-a000-000000000001',
                  title: 'mockedTitle',
                  authors: [
                    {
                      id: 'a0000000-0000-4000-a000-000000000001',
                      name: 'J.K. Rowling',
                    },
                  ],
                  releaseDate: '20240502',
                  description: 'mockedDescription',
                },
                {
                  id: 'a0000000-0000-4000-a000-000000000002',
                  title: 'Harry Potter e a Pedra filosofal',
                  authors: [
                    {
                      id: 'a0000000-0000-4000-a000-000000000001',
                      name: 'J.K. Rowling',
                    },
                  ],
                  releaseDate: '19970502',
                  description: 'livro do harry potter',
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
  list(@Query() input: ListBooksInput) {
    return this.listBooksUseCase.perform(input);
  }
}
