import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { AppMongoService } from './app.mongo.service';
import config, { Configuration } from './config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useCreateIndex: true,
    }),
    CatsModule,
  ],
  providers: [
    AppMongoService,
    {
      provide: 'CONFIG',
      useFactory: (): Configuration => {
        const envConfig = config()[process.env.NODE_ENV ?? 'dev'];
        if (!envConfig)
          throw new Error(`no config for ${process.env.NODE_ENV}`);
        return envConfig;
      },
    },
  ],
  exports: [AppMongoService],
})
export class AppModule {}
