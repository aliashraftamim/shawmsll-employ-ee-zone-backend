import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";

import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";

import { awsUpload } from "../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
import { chatController } from "./chat.controller";
import { chatValidator } from "./chat.validation";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  // validateRequest(chatValidator.getChatSchema),
  chatController.getMyChat
);

router.get(
  "/partners",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  chatController.getMyPartners
);

router.post(
  "/send-images",
  auth(USER_ROLE.USER, USER_ROLE.USER),
  upload.fields([{ name: "images", maxCount: 5 }]),
  validateRequest(chatValidator.addImages),
  awsUpload.AwsUploader({
    fieldName: "images",
    isImage: true,
    multiple: true,
    required: true,
    maxSizeMB: 50,
  }),
  chatController.sendImages
);

export const chatRouter = router;
