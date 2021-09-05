import { Body, Controller, Get, Post } from "@nestjs/common";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./create-cat.dto";
import { Cat } from "./cat.schema";
import { ICat } from "./cat.interface";

@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<ICat> {
    const cat = await this.catsService.create(createCatDto);
    return cat;
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
