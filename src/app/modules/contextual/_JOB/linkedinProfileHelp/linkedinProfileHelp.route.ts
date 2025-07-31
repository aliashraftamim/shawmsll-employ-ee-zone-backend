import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.single";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { linkedinProfileHelp_controller } from "./linkedinProfileHelp.controller";
import { linkedinProfileHelp_validation } from "./linkedinProfileHelp.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(linkedinProfileHelp_validation.createLinkedinProfileHelp),
  AwsUploadSingle("image"),
  linkedinProfileHelp_controller.createLinkedinProfileHelp
);

router.get("/", linkedinProfileHelp_controller.getAllLinkedinProfileHelp);

router.get("/:id", linkedinProfileHelp_controller.getLinkedinProfileHelpById);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(linkedinProfileHelp_validation.updateLinkedinProfileHelp),
  AwsUploadSingle("image"),
  linkedinProfileHelp_controller.updateLinkedinProfileHelp
);

router.delete(
  "/:id",
  linkedinProfileHelp_controller.softDeleteLinkedinProfileHelp
);

export const linkedinProfileHelp_route = router;
