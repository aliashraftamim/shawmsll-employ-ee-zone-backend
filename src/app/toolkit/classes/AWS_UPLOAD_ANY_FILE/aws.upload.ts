/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS from "aws-sdk";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { CONFIG } from "../../../core/config";
import AppError from "../../../core/error/AppError";
import catchAsync from "../../utils/catchAsync";

// ✅ Multer memory storage with filter
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

type TUploadConfig = {
  fieldName: string;
  isImage: boolean;
  multiple: boolean;
  required: boolean;
  maxSizeMB: number;
};

export class AwsUploadHandler {
  protected s3Client;

  constructor() {
    this.s3Client = new AWS.S3({
      accessKeyId: CONFIG.DO_SPACE.DO_SPACE_ACCESS_KEY,
      secretAccessKey: CONFIG.DO_SPACE.DO_SPACE_SECRET_KEY,
      region: CONFIG.DO_SPACE.DO_SPACE_REGION,
      endpoint: CONFIG.DO_SPACE.DO_SPACE_ENDPOINT,
      s3ForcePathStyle: false,
    });
  }

  // ✅ Multer instance (use .fields([...]) in route)
  upload = multer({ storage, fileFilter, limits });

  // 🔹 Upload file to S3
  private async uploadToS3(
    file: Express.Multer.File,
    isImage: boolean,
    folder: string
  ) {
    const baseName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_");

    const uniqueId = uuidv4();
    const fileExt = isImage
      ? "webp"
      : file.originalname.split(".").pop() || "bin";

    const uniqueFileName = `${CONFIG.CORE.app_name}-${baseName}-${uniqueId}.${fileExt}`;
    console.log(
      "🚀 ~ AwsUploadHandler ~ uploadToS3 ~ uniqueFileName:",
      uniqueFileName
    );
    const Key = `${folder}/${uniqueFileName}`;
    const ContentType = isImage ? "image/webp" : file.mimetype;

    const Body = isImage
      ? await sharp(file.buffer)
          .resize({ width: 800 })
          .webp({ quality: 80 })
          .toBuffer()
      : file.buffer;

    const uploaded = await this.s3Client
      .upload({
        Bucket: CONFIG.DO_SPACE.DO_SPACE_BUCKET!,
        Key,
        Body,
        ContentType,
        ACL: "public-read",
      })
      .promise();

    return uploaded.Location;
  }

  // 🔹 Unified uploader
  AwsUploader = (...fields: TUploadConfig[]) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      // ✅ Safe fallback: merge req.file → req.files
      let allFiles: Record<
        string,
        Express.Multer.File[] | Express.Multer.File
      > = (req.files as any) || {};
      if (req.file) {
        allFiles = { ...allFiles, [req.file.fieldname]: req.file };
      }

      for (const field of fields) {
        let files: Express.Multer.File[] = [];
        const fieldFiles = allFiles?.[field.fieldName];

        if (Array.isArray(fieldFiles)) files = fieldFiles;
        else if (fieldFiles) files = [fieldFiles];

        // 🔹 required validation
        if ((!files || files.length === 0) && field.required) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Missing required field: ${field.fieldName}`
          );
        }

        // 🔹 file size validation
        if (files.length > 0 && field.maxSizeMB) {
          const sizeLimitBytes = field.maxSizeMB * 1024 * 1024;
          for (const file of files) {
            if (file.size > sizeLimitBytes) {
              throw new AppError(
                httpStatus.BAD_REQUEST,
                `File size limit exceeded for field: ${field.fieldName}`
              );
            }
          }
        }

        // 🔹 Upload files to S3
        if (files.length > 0) {
          const uploaded = await Promise.all(
            files.map((f) =>
              this.uploadToS3(
                f,
                field.isImage,
                field.isImage ? "images" : "documents"
              )
            )
          );
          req.body[field.fieldName] = field.multiple ? uploaded : uploaded[0];
        } else {
          req.body[field.fieldName] = field.multiple ? [] : null;
        }
      }

      next();
    });
}

export const awsUpload = new AwsUploadHandler();
