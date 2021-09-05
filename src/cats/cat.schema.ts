import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ICat } from "./cat.interface";

export type CatDocument = Omit<Cat, "id"> & Document & { toInterface(): ICat };

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ min: 0 })
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass<Cat, CatDocument>(
  Cat
).method("toInterface", function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
});
