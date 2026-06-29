import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard, AdminGuard } from '@/infra/guards';
import {
  ApproveLibrarianAccessUseCase,
  DeactivateLibrarianAccessUseCase,
  ListLibrariansUseCase,
} from './usecases';
import { ApproveLibrarianAccess, ListPaginatedLibrarians } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

enum LibrarianStatus {
  DISABLED = 'DISABLED',
  APPROVED = 'APPROVED',
  PENDING_APPROVE = 'PENDING_APPROVE',
}

@Injectable()
@Controller('librarians')
export class LibrariansController {
  constructor(
    private readonly approveLibrarianAccessUseCase: ApproveLibrarianAccessUseCase,
    private readonly deactivateLibrarianAccessUseCase: DeactivateLibrarianAccessUseCase,
    private readonly listLibrariansUseCase: ListLibrariansUseCase,
  ) {}

  @Post('approve')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar criacao da conta de bibliotecaria' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        librarianId: { type: 'string', title: 'ID do bibliotecario' },
      },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          librarianId: 'a0000000-0000-4000-a000-000000000004',
        },
      },
      emptyField: {
        summary: 'Campo vazio',
        value: {
          librarianId: '',
        },
      },
      userNotFound: {
        summary: 'Usuario nao encontrado',
        value: {
          librarianId: 'a0000000-0000-4000-a000-000000001114',
        },
      },
      disabledUser: {
        summary: 'Usuario desativado nao pode ser aprovado',
        value: {
          librarianId: 'a0000000-0000-4000-a000-000000000005',
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
            summary: 'Cadastro aprovado com sucesso',
            value: true,
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
          emptyField: {
            summary: 'Campo faltante',
            value: {
              message: 'The librarianId field is required.',
            },
          },
          userNotFound: {
            summary: 'Usuario nao encontrado',
            value: {
              message: 'User not found.',
            },
          },
          disabledUser: {
            summary: 'Usuario desabilitado nao pode ser aprovado',
            value: {
              message: 'Disabled librarian account cannot be approved.',
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
            summary: 'Somente admin tem acesso a funcionalidade',
            value: {
              message: 'Admin access is required.',
            },
          },
        },
      },
    },
  })
  async approve(@Body() input: ApproveLibrarianAccess) {
    return this.approveLibrarianAccessUseCase.perform(input);
  }

  @Post('deactivate')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desativar conta de bibliotecaria' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        librarianId: { type: 'string', title: 'ID do bibliotecario' },
      },
    },
    examples: {
      valid: {
        summary: 'Entrada valida',
        value: {
          librarianId: 'a0000000-0000-4000-a000-000000000001',
        },
      },
      emptyField: {
        summary: 'Campo vazio',
        value: {
          librarianId: '',
        },
      },
      userNotFound: {
        summary: 'Usuario nao encontrado',
        value: {
          librarianId: 'a0000000-0000-4000-a000-000000001114',
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
            summary: 'Cadastro desativado com sucesso',
            value: true,
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
          emptyField: {
            summary: 'Campo faltante',
            value: {
              message: 'The librarianId field is required.',
            },
          },
          userNotFound: {
            summary: 'Usuario nao encontrado',
            value: {
              message: 'User not found.',
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
            summary: 'Somente admin tem acesso a funcionalidade',
            value: {
              message: 'Admin access is required.',
            },
          },
        },
      },
    },
  })
  async deactivate(@Body() input: ApproveLibrarianAccess) {
    return this.deactivateLibrarianAccessUseCase.perform(input);
  }

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar bibliotecarios' })
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
  @ApiQuery({
    name: 'statuses',
    type: 'string',
    nullable: true,
    enum: LibrarianStatus,
    isArray: true,
    required: false,
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          approved: {
            summary: 'Listar aprovados',
            value: {
              page: 1,
              records: 1,
              items: [
                {
                  id: 'a0000000-0000-4000-a000-000000000001',
                  name: 'mockedLibrarianName',
                  lastName: 'mockedLibrarianLastName',
                  email: 'mockedLibrarianEmail',
                  password:
                    'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
                  role: 'LIBRARIAN',
                  createdAt: '2020-01-01T04:00:00.000Z',
                  approved: true,
                  disabled: false,
                  disabledAt: null,
                  approvedAt: '2077-01-01T04:00:00.000Z',
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
          librarianAccess: {
            summary: 'Somente admin tem acesso a funcionalidade',
            value: {
              message: 'Admin access is required.',
            },
          },
        },
      },
    },
  })
  async listLibrarians(@Query() input: ListPaginatedLibrarians) {
    return this.listLibrariansUseCase.perform(input);
  }
}
