/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS from "aws-sdk";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid"; // 🔹 Import UUID
import { CONFIG } from "../../../core/config";
import AppError from "../../../core/error/AppError";
import catchAsync from "../../utils/catchAsync";

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
      accessKeyId: CONFIG.AWS.aws_access_key_id,
      secretAccessKey: CONFIG.AWS.aws_secret_access_key,
    });
  }

  // Multer memory storage
  upload = multer();

  // 🔹 Common S3 uploader with UUID for unique filenames
  private async uploadToS3(
    file: Express.Multer.File,
    isImage: boolean,
    folder: string
  ) {
    const baseName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_");

    const uniqueId = uuidv4(); // 🔹 ensure global uniqueness

    const fileExt = isImage
      ? "webp"
      : file.originalname.split(".").pop() || "bin";

    const uniqueFileName = `${CONFIG.CORE.app_name}-${baseName}-${uniqueId}.${fileExt}`;
    const Key = `${folder}/${uniqueFileName}`;
    const ContentType = isImage ? "image/webp" : file.mimetype;

    const Body = isImage
      ? await sharp(file.buffer)
          .resize({ width: 800 })
          .webp({ quality: 80 })
          .toBuffer()
      : file.buffer;

    const uploaded = await this.s3Client
      .upload({ Bucket: CONFIG.AWS.aws_bucket!, Key, Body, ContentType })
      .promise();

    return uploaded.Location;
  }

  // 🔹 Unified handler for images/docs, single/multiple, required & max size
  AwsUploader = (...fields: TUploadConfig[]) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const allFiles = req.files as {
        [field: string]: Express.Multer.File[] | Express.Multer.File;
      };

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
