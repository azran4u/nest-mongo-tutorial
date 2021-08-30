import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppMongoService } from './app.mongo.service';
import { Configuration } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(AppMongoService);
  const port = app.get<Configuration>('CONFIG').port;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
