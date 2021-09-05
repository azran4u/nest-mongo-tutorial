import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { childLogger } from "../logger";
import { Logger } from "winston";
import { Cat } from "../graphql.schema";
import { CatDocument } from "./cat.schema";
import { CreateCatDto } from "./create-cat.dto";
import { ICat } from "./cat.interface";
import * as _ from "lodash";
import * as Joi from "joi";
@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.logger = childLogger(logger, { service: "CatService" });
  }

  async create(cat: CreateCatDto): Promise<ICat> {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      age: Joi.number().integer().min(5).max(35),
      breed: Joi.any().valid("breed1", "breed2"),
    });
    const validationRes = schema.validate(cat);
    if (validationRes.error) {
      throw new BadRequestException(validationRes.error);
    }
    let createdCat: CatDocument;
    try {
      createdCat = await this.catModel.create(cat);
    } catch (error) {
      throw new InternalServerErrorException(error, "Database error");
    }
    return createdCat.toInterface();
  }

  async findAll(): Promise<ICat[]> {
    let cats: CatDocument[];
    try {
      cats = await this.catModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error, "Database error");
    }
    if (_.isNil(cats)) cats = [];
    return cats.map((cat) => cat.toInterface());
  }

  async findOneById(id: string): Promise<ICat> {
    let cat: CatDocument;
    try {
      cat = await this.catModel.findOne({ id }).exec();
    } catch (error) {
      throw new InternalServerErrorException(error, "Database error");
    }
    if (_.isNil(cat))
      throw new NotFoundException(
        undefined,
        `cat with id ${id} doesn't exists`
      );
    return cat.toInterface();
  }
}
