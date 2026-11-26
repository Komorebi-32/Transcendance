import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { API_PREFIX } from '@ft/shared';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // Every REST route lives under /api; the proxy forwards /api/* here (see infra/proxy).
  app.setGlobalPrefix(API_PREFIX);
  app.enableShutdownHooks();

  const port = Number(process.env.API_PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
