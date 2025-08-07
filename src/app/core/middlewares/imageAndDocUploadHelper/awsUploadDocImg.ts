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

export const AwsUploadDocImg = (...fields: TUploadConfig[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allFiles = req.files as {
      [fieldname: string]: Express.Multer.File[] | Express.Multer.File;
    };

    console.log("📁 All Uploaded Files:", allFiles);

    for (const field of fields) {
      const fieldFiles = allFiles?.[field.fieldName];

      // ✅ Always flatten correctly
      let files: Express.Multer.File[] = [];

      if (Array.isArray(fieldFiles)) {
        files = fieldFiles;
      } else if (fieldFiles) {
        files = [fieldFiles];
      }

      console.log(`🧾 Files for field "${field.fieldName}":`, files);
      console.log(`✅ First file originalname:`, files[0]?.originalname);

      const uploadedUrls: string[] = [];

      for (const file of files) {
        // ❗ Validate file before using
        if (!file?.originalname) {
          console.error(`❌ File for field "${field.fieldName}" is missing or malformed.`);
          return res.status(400).json({
            message: `Missing or malformed file for ${field.fieldName}`,
          });
        }

        const originalName =
          req.body[`${field.fieldName}Name`] ||
          (file.originalname ? file.originalname.split(".")[0] : `file-${Date.now()}`);

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
          console.log(`✅ Uploaded to S3: ${uploaded.Location}`);
          uploadedUrls.push(uploaded.Location);
        } catch (err) {
          console.error(`❌ Upload failed for field "${field.fieldName}":`, err);
          return res.status(500).json({
            message: `Upload failed for ${field.fieldName}`,
            error: err,
          });
        }
      }

      // ✅ Attach uploaded URL(s) to req.body
      req.body[field.fieldName] = field.multiple
        ? uploadedUrls
        : uploadedUrls[0] || null;
    }

    next();
  });
};
