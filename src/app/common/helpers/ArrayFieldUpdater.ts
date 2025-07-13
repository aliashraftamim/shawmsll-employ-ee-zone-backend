import httpStatus from "http-status";
import mongoose, { Model } from "mongoose";
import AppError from "../../core/error/AppError";

interface ReplaceOptions {
  from: string;
  to: string;
}

export class ArrayFieldUpdater {
  private model: Model<any>;
  private documentId: string;
  private field: string;

  constructor(model: Model<any>, documentId: string, field: string) {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid document ID");
    }

    this.model = model;
    this.documentId = documentId;
    this.field = field;
  }

  private async getDocument() {
    const doc = await this.model.findById(this.documentId);
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Document not found");

    const arrayField = doc[this.field];
    if (!Array.isArray(arrayField)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Field "${this.field}" is not an array`
      );
    }

    return doc;
  }

  async add(value: string) {
    const doc = await this.getDocument();
    const array: string[] = doc[this.field];

    if (!array.includes(value)) {
      array.push(value);
    }

    return await doc.save();
  }

  async remove(value: string) {
    const doc = await this.getDocument();

    doc[this.field] = doc[this.field].filter((item: string) => item !== value);

    return await doc.save();
  }

  async replace({ from, to }: ReplaceOptions) {
    const doc = await this.getDocument();

    doc[this.field] = doc[this.field].map((item: string) =>
      item === from ? to : item
    );

    return await doc.save();
  }
}
