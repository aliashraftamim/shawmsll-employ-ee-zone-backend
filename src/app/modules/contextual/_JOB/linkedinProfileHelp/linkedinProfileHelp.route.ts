import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadDocuments } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.multipleDoc";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { linkedinProfileHelp_controller } from "./linkedinProfileHelp.controller";
import { linkedinProfileHelp_validation } from "./linkedinProfileHelp.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(linkedinProfileHelp_validation.createLinkedinProfileHelp),
  AwsUploadDocuments("documents"),
  linkedinProfileHelp_controller.createLinkedinProfileHelp
);

router.get("/", linkedinProfileHelp_controller.getAllLinkedinProfileHelp);

router.get("/:id", linkedinProfileHelp_controller.getLinkedinProfileHelpById);

router.put(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(linkedinProfileHelp_validation.updateLinkedinProfileHelp),
  AwsUploadDocuments("documents"),
  linkedinProfileHelp_controller.updateLinkedinProfileHelp
);

router.delete(
  "/:id",
  linkedinProfileHelp_controller.softDeleteLinkedinProfileHelp
);

export const linkedinProfileHelp_route = router;
