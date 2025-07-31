import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadDocuments } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.multipleDoc";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { resumeTips_controller } from "./resumeTips.controller";
import { resumeTips_validation } from "./resumeTips.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(resumeTips_validation.createResumeTips),
  AwsUploadDocuments("documents"),
  resumeTips_controller.createResumeTips
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  resumeTips_controller.getAllResumeTips
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  resumeTips_controller.getResumeTipsById
);

router.put(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(resumeTips_validation.updateResumeTips),
  AwsUploadDocuments("documents"),
  resumeTips_controller.updateResumeTips
);

router.delete("/:id", resumeTips_controller.softDeleteResumeTips);

export const resumeTips_route = router;
