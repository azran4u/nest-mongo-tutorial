import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { JoiValidationPipe } from "src/utils/joi.validation.pipe";
import { ICat } from "./cat.interface";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./create-cat.dto";
import * as Joi from "joi";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject } from "@nestjs/common";
import { childLogger } from "../logger";

const pubSub = new PubSub();

@Resolver("Cat")
export class CatsResolver {
  constructor(
    private readonly catsService: CatsService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {
    this.logger = childLogger(this.logger, { service: "CatsResolver" });
  }

  @Query("cats")
  async getCats(): Promise<ICat[]> {
    return this.catsService.findAll();
  }

  @Query("cat")
  async findOneById(
    @Args("id")
    id: string
  ): Promise<ICat> {
    return this.catsService.findOneById(id);
  }

  @Mutation("createCat")
  async create(
    @Args(
      "createCatInput",
      JoiValidationPipe(
        Joi.object({
          name: Joi.string().min(3).max(30).required(),
          age: Joi.number().integer().min(5).max(35),
          breed: Joi.any().valid("breed1", "breed2"),
        })
      )
    )
    args: CreateCatDto
  ): Promise<ICat> {
    const createdCat = await this.catsService.create(args);
    await pubSub.publish("catCreated", { catCreated: createdCat });
    return createdCat;
  }

  @Subscription("catCreated")
  catCreated() {
    return pubSub.asyncIterator("catCreated");
  }
}
