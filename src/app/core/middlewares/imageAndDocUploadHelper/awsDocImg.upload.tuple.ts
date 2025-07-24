/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import type { Express } from "express";
import sharp from "sharp";
import { s3Client } from "./awsS3Client";
import { CONFIG } from "../../config";
import catchAsync from "../../../common/utils/catchAsync";

type TUploadConfig = {
  fieldName: string;
  isImage: boolean;
  multiple: boolean;
};



export const awsFlexibleUploader = (...fields: TUploadConfig[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allFiles = req.files as {
      [fieldname: string]: Express.Multer.File[] | Express.Multer.File;
    };

    for (const field of fields) {
      const fieldFiles = allFiles[field.fieldName];

      const files: Express.Multer.File[] = field.multiple
        ? (fieldFiles as Express.Multer.File[]) || []
        : fieldFiles
        ? [fieldFiles as Express.Multer.File]
        : [];

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const originalName =
          req.body[`${field.fieldName}Name`] || file.originalname.split(".")[0];
        const sanitizedName = originalName.replace(/\s+/g, "_").toLowerCase();
        const fileExt = field.isImage ? "webp" : file.originalname.split(".").pop();
        const uniqueFileName = `${sanitizedName}-${Date.now()}.${fileExt}`;
        const Key = field.isImage
          ? `images/${uniqueFileName}`
          : `documents/${uniqueFileName}`;
        const ContentType = field.isImage ? "image/webp" : file.mimetype;

        const Body = field.isImage
          ? await sharp(file.buffer)
              .resize({ width: 800 })
              .webp({ quality: 80 })
              .toBuffer()
          : file.buffer;

        const params = {
          Bucket: CONFIG.AWS.aws_bucket ?? "",
          Key,
          Body,
          ContentType,
        };

        try {
          const uploaded = await s3Client.upload(params).promise();
          uploadedUrls.push(uploaded.Location);
        } catch (err) {
          console.error(`Upload failed for ${field.fieldName}:`, err);
          return res.status(500).json({
            message: `Upload failed for ${field.fieldName}`,
            error: err,
          });
        }
      }

      req.body[field.fieldName] = field.multiple
        ? uploadedUrls
        : uploadedUrls[0] || null;
    }

    next();
  });
};
