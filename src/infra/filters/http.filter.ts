import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message;

    response.status(status).json({
      statusCode: status,
      message:
        typeof message === 'object' && 'message' in message
          ? (message as { message: string }).message
          : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
