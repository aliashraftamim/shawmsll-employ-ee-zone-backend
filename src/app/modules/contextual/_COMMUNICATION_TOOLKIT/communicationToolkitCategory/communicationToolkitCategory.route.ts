import { Router } from "express";

import { USER_ROLE } from "../../../../core/constants/global.constants";
import { upload } from "../../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
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
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
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
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(
    communicationToolkitCategoryValidation.updateCommunicationToolkitCategory
  ),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  communicationToolkitCategory_controller.updateCommunicationToolkitCategory
);
router.delete(
  "/:id",
  communicationToolkitCategory_controller.softDeleteCommunicationToolkitCategory
);

export const communicationToolkitCategoryRoute = router;
