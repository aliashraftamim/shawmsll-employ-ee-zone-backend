/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../toolkit/utils/catchAsync";
import { CONFIG } from "../../config";
import { s3Client } from "./awsS3Client";

export const AwsUploadDocuments = (fieldName: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let files: Express.Multer.File[] = [];

    if (req.files) {
      if (!Array.isArray(req.files)) {
        files = req.files[fieldName] || [];
      } else {
        files = req.files;
      }
    }

    if (files.length > 0) {
      const uploadedLocations: string[] = [];

      for (const file of files) {
        const timestamp = Date.now();
        const fileExtension = file.originalname.split(".").pop();
        const baseName = file.originalname.replace(/\.[^/.]+$/, "");
        const uniqueFileName = `${CONFIG.CORE.app_name}-${baseName}-${timestamp}.${fileExtension}`;

        const params = {
          Bucket: CONFIG.AWS.aws_bucket,
          Key: `documents/${uniqueFileName}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        try {
          const uploadedDocument = await s3Client
            .upload(params as any)
            .promise();
          uploadedLocations.push(uploadedDocument.Location);
        } catch (error) {
          console.error("Error uploading document to S3: ", error);
          return res.status(500).json({ error: "Failed to upload documents." });
        }
      }

      req.body[fieldName] = uploadedLocations;
    }

    next();
  });
};
