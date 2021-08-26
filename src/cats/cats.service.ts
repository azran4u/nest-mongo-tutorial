import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from './create-cat.dto';
import { Cat, CatDocument } from './cat.schema';
import { ICat } from './cat.interface';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<CatDocument>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<ICat> {
    // const catModel = new this.catModel(createCatDto);
    const createdCat = await this.catModel.create(createCatDto);
    const id = createdCat._id;
    delete createdCat['_id'];
    return { ...createdCat, id };
  }

  async findAll(): Promise<ICat[]> {
    const cats = await this.catModel.find().exec();
    return cats.map(cat => {
      const id = cat._id;
      delete cat['_id'];
      return { ...cat, id };
    });
  }
}
