import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { WinstonModule } from "nest-winston";
import { CatsModule } from "./cats/cats.module";
import { AppConfigModule, AppConfigService } from "./config";
import { loggerOptionsFactory } from "./logger";

@Module({
  imports: [
    AppConfigModule,
    WinstonModule.forRootAsync({
      useFactory: (configService: AppConfigService) => {
        return loggerOptionsFactory(configService);
      },
      inject: [AppConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.getConfig().database.url,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [AppConfigService],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      typePaths: ["./**/*.graphql"],
      installSubscriptionHandlers: true,
    }),
    CatsModule,
  ],
})
export class AppModule {}
