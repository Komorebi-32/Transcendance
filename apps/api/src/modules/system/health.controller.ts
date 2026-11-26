import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@ft/shared';

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthResponse {
    return {
      status: 'ok',
      service: 'api',
      version: process.env.npm_package_version ?? '0.0.0',
      time: new Date().toISOString(),
    };
  }
}
