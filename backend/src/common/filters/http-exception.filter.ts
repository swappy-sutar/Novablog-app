import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the full error context on the server side
    const logDetails = {
      path: request.url,
      method: request.method,
      statusCode: status,
      body: request.body,
      query: request.query,
      params: request.params,
    };

    if (exception instanceof Error) {
      this.logger.error(
        `Unhandled exception: ${exception.message} at ${request.method} ${request.url}`,
        exception.stack,
        JSON.stringify(logDetails),
      );
    } else {
      this.logger.error(
        `Unhandled exception (non-error object): ${JSON.stringify(exception)} at ${request.method} ${request.url}`,
        undefined,
        JSON.stringify(logDetails),
      );
    }

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Internal server error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const exceptionMsg = (exceptionResponse as any).message;
      if (Array.isArray(exceptionMsg)) {
        message = exceptionMsg.join(', ');
      } else if (typeof exceptionMsg === 'string') {
        message = exceptionMsg;
      }
    }

    // Prevent information leakage:
    // 1. If it's a 500 error, never leak any details. Return a generic message.
    // 2. For 4xx errors, scan the message for database names, paths, schema details or extensions.
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'An unexpected error occurred. Please try again later.';
    } else if (this.isMessageSensitive(message)) {
      message = 'An error occurred while processing your request.';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.url,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private isMessageSensitive(message: string): boolean {
    if (!message) return false;

    const sensitivePatterns = [
      /prisma/i,             // Prisma database client
      /sql/i,                // SQL statements/errors
      /database/i,           // Database keyword
      /postgres/i,           // PostgreSQL
      /mongodb/i,            // MongoDB
      /mongoose/i,           // Mongoose
      /sqlite/i,             // SQLite
      /c:\\/i,               // Windows absolute path indicator
      /\\/i,                 // Windows path separator
      /\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+/i, // Unix-like path structure
      /\.(ts|js|node|json)/i, // Internal code file extensions
    ];

    return sensitivePatterns.some((pattern) => pattern.test(message));
  }
}
