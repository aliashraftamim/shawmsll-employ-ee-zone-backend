import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.single";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { guidanceOnLeavingBenefits_controller } from "./GuidanceOnLeavingBenefits.controller";
import { guidanceOnLeavingBenefits_validation } from "./GuidanceOnLeavingBenefits.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(
    guidanceOnLeavingBenefits_validation.createGuidanceOnLeavingBenefits
  ),
  AwsUploadSingle("image"),
  guidanceOnLeavingBenefits_controller.createGuidanceOnLeavingBenefits
);

router.get(
  "/",
  guidanceOnLeavingBenefits_controller.getAllGuidanceOnLeavingBenefits
);

router.get(
  "/:id",
  guidanceOnLeavingBenefits_controller.getGuidanceOnLeavingBenefitsById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(
    guidanceOnLeavingBenefits_validation.updateGuidanceOnLeavingBenefits
  ),
  AwsUploadSingle("image"),
  guidanceOnLeavingBenefits_controller.updateGuidanceOnLeavingBenefits
);

router.delete(
  "/:id",
  guidanceOnLeavingBenefits_controller.softDeleteGuidanceOnLeavingBenefits
);

export const guidanceOnLeavingBenefits_route = router;
