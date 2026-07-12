import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'NovaBlog API',
      version: 'v1',
      status: 'running',
      docs: '/api/v1',
      health: '/health',
    };
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('favicon.ico')
  favicon(@Res() res: Response) {
    // Browsers auto-request favicon.ico — return 204 No Content to silence 404 logs.
    res.status(204).end();
  }
}
