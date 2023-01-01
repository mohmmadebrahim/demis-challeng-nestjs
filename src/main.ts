import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  app.useGlobalPipes(new ValidationPipe({
    // whitelist: true,
    // forbidNonWhitelisted : true,
    // transform: true,
  }));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  app.enableCors();
  await app.listen(port);
}
bootstrap();
