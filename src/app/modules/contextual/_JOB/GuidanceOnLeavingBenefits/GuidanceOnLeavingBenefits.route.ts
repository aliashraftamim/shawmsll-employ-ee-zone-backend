import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadDocuments } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.multipleDoc";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { guidanceOnLeavingBenefits_controller } from "./GuidanceOnLeavingBenefits.controller";
import { guidanceOnLeavingBenefits_validation } from "./GuidanceOnLeavingBenefits.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(
    guidanceOnLeavingBenefits_validation.createGuidanceOnLeavingBenefits
  ),
  AwsUploadDocuments("documents"),
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
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(
    guidanceOnLeavingBenefits_validation.updateGuidanceOnLeavingBenefits
  ),
  AwsUploadDocuments("documents"),
  guidanceOnLeavingBenefits_controller.updateGuidanceOnLeavingBenefits
);

router.delete(
  "/:id",
  guidanceOnLeavingBenefits_controller.softDeleteGuidanceOnLeavingBenefits
);

export const guidanceOnLeavingBenefits_route = router;
