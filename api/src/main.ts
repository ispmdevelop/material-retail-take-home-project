import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import type { Express } from 'express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const httpAdapter = app.getHttpAdapter() as { getInstance: () => Express };
  const server = httpAdapter.getInstance();
  const publicDir = join(process.cwd(), 'public');
  const indexPath = join(publicDir, 'index.html');
  const indexHtml = existsSync(indexPath) ? readFileSync(indexPath, 'utf-8') : null;

  server.use(express.static(publicDir));

  server.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/api')) return next();
    if (indexHtml) {
      res.type('text/html');
      return res.send(indexHtml);
    }
    next();
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
await bootstrap();
