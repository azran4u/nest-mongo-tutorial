import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCatDto } from "./create-cat.dto";
import { Cat, CatDocument } from "./cat.schema";
import { ICat } from "./cat.interface";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { childLogger } from "../logger";
import { docToInterface } from "src/utils/mongo.doc-to-interface";

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.logger = childLogger(logger, { service: "CatService" });
  }

  async create(createCatDto: CreateCatDto): Promise<ICat> {
    const createdCat = await this.catModel.create(createCatDto);
    this.logger.info(`created a new cat`);
    return createdCat.toInterface();
  }

  async update(updateCat: ICat): Promise<ICat> {
    const cat = await this.catModel.findByIdAndUpdate(
      { _id: updateCat.id },
      updateCat,
      { new: true, upsert: true }
    );
    const id = cat._id;
    delete cat["_id"];
    return { ...cat, id };
  }

  async findAll(): Promise<ICat[]> {
    const cats = await this.catModel.find().exec();
    return cats.map((cat) => {
      const id = cat._id;
      delete cat["_id"];
      return { ...cat, id };
    });
  }
}
