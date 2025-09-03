import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { AwsUploadSingle } from "../../../core/middlewares/!awsUploader/awsUpload.single";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { PolicyRights_controller } from "./policy&rights.controller";
import { PolicyRightsValidation } from "./policy&rights.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(PolicyRightsValidation.createPolicyRights),
  AwsUploadSingle("image"),
  PolicyRights_controller.createPolicyRights
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  PolicyRights_controller.getAllPolicyRights
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  PolicyRights_controller.getPolicyRightsById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(PolicyRightsValidation.updatePolicyRights),
  AwsUploadSingle("image"),
  PolicyRights_controller.updatePolicyRights
);

router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  PolicyRights_controller.softDeletePolicyRights
);

export const PolicyRightsRoute = router;
