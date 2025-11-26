import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
import { PolicyRights_controller } from "./policy&rights.controller";
import { PolicyRightsValidation } from "./policy&rights.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateRequest(PolicyRightsValidation.policyRightsCreateSchema),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 100,
  }),
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
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateRequest(PolicyRightsValidation.policyRightsUpdateSchema),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  PolicyRights_controller.updatePolicyRights
);

router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  PolicyRights_controller.softDeletePolicyRights
);

export const PolicyRightsRoute = router;
