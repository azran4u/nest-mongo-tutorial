import { Document } from "mongoose";

export function docToInterface(doc: Document) {
  const id = doc._id;
  delete doc["_id"];
  return { ...doc, id };
}
