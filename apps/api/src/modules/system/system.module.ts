import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/** Owner: A (platform). Health check and, later, the reference example for adding-a-feature.md. */
@Module({
  controllers: [HealthController],
})
export class SystemModule {}
