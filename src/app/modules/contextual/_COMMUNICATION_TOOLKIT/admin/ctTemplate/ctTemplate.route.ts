import { Router } from "express";
import { USER_ROLE } from "../../../../../core/constants/global.constants";
import auth from "../../../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.single";
import { upload } from "../../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../../core/middlewares/validateRequest";
import { ctTemplate_controller } from "./ctTemplate.controller";
import { ctTemplate_validation } from "./ctTemplate.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(ctTemplate_validation.createCtTemplate),
  AwsUploadSingle("image"),
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
  upload.single("image"),
  validateRequest(ctTemplate_validation.updateCtTemplate),
  AwsUploadSingle("image"),
  ctTemplate_controller.updateCtTemplate
);

router.delete(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  ctTemplate_controller.softDeleteCtTemplate
);

export const ctTemplate_route = router;
