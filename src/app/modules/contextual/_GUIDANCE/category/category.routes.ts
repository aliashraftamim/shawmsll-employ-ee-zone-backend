import { Router } from "express";

import { USER_ROLE } from "../../../../core/constants/global.constants";
import { upload } from "../../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
import { categoryController } from "./category.controller";
import { categoryValidator } from "./category.validation";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(categoryValidator.createCategoryValidationSchema),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: true,
    maxSizeMB: 10,
  }),
  categoryController.createCategory
);

router.put(
  "/update-scenario/:categoryId",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  validateRequest(categoryValidator.updateScenarioInCategory),
  categoryController.updateScenarioInCategory
);

router.put(
  "/:categoryId",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  upload.single("image"),
  validateRequest(categoryValidator.updateCategoryValidationSchema),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  categoryController.updateCategory
);

router.get(
  "/:categoryId",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  categoryController.getSingleCategory
);

router.delete(
  "/delete/:categoryId",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  categoryController.deleteCategory
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN, USER_ROLE.USER),
  categoryController.getCategory
);

export const categoryRouter = router;
