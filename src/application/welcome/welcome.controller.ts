import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('welcome')
@Controller('welcome')
export class WelcomeController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hello world' })
  hello() {
    return {
      message: 'Hello world',
    };
  }
}
