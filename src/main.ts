import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port);
  const logger = app.get<Logger>(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
