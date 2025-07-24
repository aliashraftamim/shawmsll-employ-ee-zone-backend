import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../core/middlewares/imageAndDocUploadHelper/awsUpload.single";
import { upload } from "../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../core/middlewares/validateRequest";
import { policyCategory_controller } from "./policyCategory.controller";
import { policyCategoryValidation } from "./policyCategory.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(policyCategoryValidation.createPolicyCategory),
  AwsUploadSingle("image"),
  policyCategory_controller.createPolicyCategory
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  policyCategory_controller.getAllPolicyCategory
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  policyCategory_controller.getPolicyCategoryById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(policyCategoryValidation.updatePolicyCategory),
  AwsUploadSingle("image"),
  policyCategory_controller.updatePolicyCategory
);

router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  policyCategory_controller.softDeletePolicyCategory
);

export const policyCategoryRoute = router;
