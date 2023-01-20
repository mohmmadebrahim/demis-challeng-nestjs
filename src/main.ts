import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType, NestInterceptor } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { setupSwagger } from './utils/setup-swagger.util';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  app.useGlobalPipes(new ValidationPipe({
    // whitelist: true,
    // forbidNonWhitelisted : true,
    transform: true,
  }));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  app.enableCors();
  setupSwagger(app)
  await app.listen(port);
}
bootstrap();
