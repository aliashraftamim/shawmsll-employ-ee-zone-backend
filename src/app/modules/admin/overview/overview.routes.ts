import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
import { overviewController } from "./overview.controller";
import { overviewValidator } from "./overview.validation";

const router = Router();

router.get(
  "/users",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  overviewController.getUsers
);

router.get(
  "/get-user-chart",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  overviewController.getUserChart
);

router.get(
  "/get-earning-chart",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  overviewController.getEarningsChart
);

router.get(
  "/total-user-and-earnings",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  overviewController.totalUserAndEarnings
);

router.get(
  "/earning-history",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  overviewController.earningHistory
);

router.put(
  "/update-admin",
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  auth(USER_ROLE.ADMIN),
  validateRequest(overviewValidator.updateAdminValidationSchema),
  awsUpload.AwsUploader({
    fieldName: "profileImage",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  overviewController.updateAdmin
);

export const overviewRouter = router;
