import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CatsService } from "./cats.service";
import { Cat, CatSchema } from "./cat.schema";
import { CatsResolver } from "./cats.resolver";

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [],
  providers: [CatsService, CatsResolver],
})
export class CatsModule {}
