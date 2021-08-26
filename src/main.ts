import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppMongoService } from './app.mongo.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(AppMongoService);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
