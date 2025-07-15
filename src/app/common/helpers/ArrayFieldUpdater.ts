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

  private async validateArrayField() {
    const doc = await this.model.findById(this.documentId);
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Document not found");

    const arrayField = doc[this.field];
    if (!Array.isArray(arrayField)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Field "${this.field}" is not an array`
      );
    }
  }

  async add(value: string) {
    await this.validateArrayField();

    return await this.model.findByIdAndUpdate(
      this.documentId,
      { $addToSet: { [this.field]: value } }, // Avoids duplicates
      { new: true }
    );
  }

  async remove(value: string) {
    await this.validateArrayField();

    return await this.model.findByIdAndUpdate(
      this.documentId,
      { $pull: { [this.field]: value } },
      { new: true }
    );
  }


  async replace({ from, to }: ReplaceOptions) {
    await this.validateArrayField();

    // ডকুমেন্ট থেকে ফিল্ডের অ্যারে নিয়ে আসা
    const doc = await this.model.findById(this.documentId).select(this.field);
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Document not found");

    const arr = doc[this.field];
    if (!Array.isArray(arr)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Field "${this.field}" is not an array`
      );
    }

    // from মান আছে কিনা চেক
    const found = arr.includes(from);
    if (!found) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Value "${from}" not found in the array "${this.field}"`
      );
    }

    // from পাওয়া গেলে replace করা
    return await this.model.updateOne({ _id: this.documentId }, [
      {
        $set: {
          [this.field]: {
            $map: {
              input: `$${this.field}`,
              as: "item",
              in: {
                $cond: [{ $eq: ["$$item", from] }, to, "$$item"],
              },
            },
          },
        },
      },
    ]);
  }
}
