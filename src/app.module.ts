import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';
import { AppMongoService } from './app.mongo.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
    }),
    CatsModule,
  ],
  providers: [AppMongoService],
  exports: [AppMongoService],
})
export class AppModule {}
