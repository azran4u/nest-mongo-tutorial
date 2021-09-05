import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { ICat } from "./cat.interface";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./create-cat.dto";

const pubSub = new PubSub();

@Resolver("Cat")
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

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
  async create(@Args("createCatInput") args: CreateCatDto): Promise<ICat> {
    const createdCat = await this.catsService.create(args);
    pubSub.publish("catCreated", { catCreated: createdCat });
    return createdCat;
  }

  @Subscription("catCreated")
  catCreated() {
    return pubSub.asyncIterator("catCreated");
  }
}
