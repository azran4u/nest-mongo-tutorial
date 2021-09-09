import { Document } from "mongoose";

export function docToInterface<T = any>(doc: Document): T {
  var obj = doc.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj as T;
}
