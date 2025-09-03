/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../common/utils/catchAsync";
import { CONFIG } from "../../config";
import { s3Client } from "./awsS3Client";

export const AwsUploadDocument = (fieldName: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const file: any = req.file;

    if (file) {
      const timestamp = Date.now();
      const fileExtension = file.originalname.split(".").pop();
      const baseName = file.originalname.replace(/\.[^/.]+$/, "");
      const uniqueFileName = `${CONFIG.CORE.app_name}-${baseName}-${timestamp}.${fileExtension}`;

      const params = {
        Bucket: CONFIG.AWS.aws_bucket,
        Key: `documents/${uniqueFileName}`, // optional folder in S3
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const uploadedDocument = await s3Client.upload(params as any).promise();
        req.body[fieldName] = uploadedDocument.Location;
      } catch (error) {
        console.error("Error uploading document to S3: ", error);
        return res.status(500).json({ error: "Failed to upload document." });
      }
    }

    next();
  });
};
