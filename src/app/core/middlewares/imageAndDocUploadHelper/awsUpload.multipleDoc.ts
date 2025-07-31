/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import catchAsync from "../../../common/utils/catchAsync";
import { CONFIG } from "../../config";
import { s3Client } from "./awsS3Client";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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

const router = express.Router();

router.post(
  "/upload",
  upload.fields([{ name: "documents", maxCount: 5 }]),
  AwsUploadDocuments("documents"),
  (req: Request, res: Response) => {
    res.json({
      message: "Files uploaded successfully!",
      uploadedFiles: req.body.documents,
    });
  }
);

export default router;
