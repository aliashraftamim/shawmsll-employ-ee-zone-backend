import { Router } from "express";

import { USER_ROLE } from "../../../../core/constants/global.constants";
import { AwsUploadSingle } from "../../../../core/middlewares/!awsUploader/awsUpload.single";
import { upload } from "../../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { communicationToolkitCategory_controller } from "./communicationToolkitCategory.controller";
import { communicationToolkitCategoryValidation } from "./communicationToolkitCategory.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(
    communicationToolkitCategoryValidation.createCommunicationToolkitCategory
  ),
  AwsUploadSingle("image"),
  communicationToolkitCategory_controller.createCommunicationToolkitCategory
);
router.get(
  "/",
  communicationToolkitCategory_controller.getAllCommunicationToolkitCategory
);
router.get(
  "/:id",
  communicationToolkitCategory_controller.getCommunicationToolkitCategoryById
);
router.put(
  "/:id",
  communicationToolkitCategory_controller.updateCommunicationToolkitCategory
);
router.delete(
  "/:id",
  communicationToolkitCategory_controller.softDeleteCommunicationToolkitCategory
);

export const communicationToolkitCategoryRoute = router;
