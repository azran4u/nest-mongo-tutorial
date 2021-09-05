import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService).getConfig();
  await app.listen(config.port);
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  logger.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
