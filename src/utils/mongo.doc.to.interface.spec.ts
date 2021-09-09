import { docToInterface } from "./mongo.doc.to.interface";
import { Document, Schema, model } from "mongoose";

describe("mongo document to interface converter", () => {
  beforeEach(async () => {});

  afterEach(() => {});

  it("convert", () => {
    const schema = new Schema({
      _id: "string",
      name: "string",
      size: "string",
    });
    const Tank = model("Tank", schema);
    const doc = new Tank({ _id: "id", name: "myname", size: "small" });
    const res = docToInterface(doc);
    expect(res).toEqual({ id: "id", name: "myname", size: "small" });
  });
});
