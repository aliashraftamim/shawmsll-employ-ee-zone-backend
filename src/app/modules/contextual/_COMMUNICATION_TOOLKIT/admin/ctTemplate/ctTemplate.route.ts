import { Router } from "express";
import { USER_ROLE } from "../../../../../core/constants/global.constants";
import { upload } from "../../../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../../../core/middlewares/auth";
import validateRequest from "../../../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
import { ctTemplate_controller } from "./ctTemplate.controller";
import { ctTemplate_validation } from "./ctTemplate.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateRequest(ctTemplate_validation.createCtTemplate),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  ctTemplate_controller.createCtTemplate
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  ctTemplate_controller.getAllCtTemplate
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  ctTemplate_controller.getCtTemplateById
);

router.put(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateRequest(ctTemplate_validation.updateCtTemplate),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  ctTemplate_controller.updateCtTemplate
);

router.delete(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  ctTemplate_controller.softDeleteCtTemplate
);

export const ctTemplate_route = router;
