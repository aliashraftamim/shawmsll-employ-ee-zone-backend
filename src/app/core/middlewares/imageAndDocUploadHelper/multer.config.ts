/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Request } from "express";
import multer from "multer";

// Multer memory storage
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File filter function
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

// File size limit (optional)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Multer configuration export
export const upload = multer({
  storage,
  fileFilter,
  limits,
});
