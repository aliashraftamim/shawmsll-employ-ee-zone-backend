import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import { AwsUploadSingle } from "../../../core/middlewares/!awsUploader/awsUpload.single";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { overviewController } from "./overview.controller";
import { overviewValidator } from "./overview.validation";

const router = Router();

router.get(
  "/get-user-chart",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  overviewController.getUserChart
);

router.put(
  "/update-admin",
  upload.single("profileImage"),
  auth(USER_ROLE.ADMIN),
  validateRequest(overviewValidator.updateAdminValidationSchema),
  AwsUploadSingle("profileImage"),
  overviewController.updateAdmin
);

export const overviewRouter = router;
