import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { docToInterface } from "../utils/mongo.doc.to.interface";
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
  return docToInterface(this);
});
