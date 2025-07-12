import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../core/middlewares/imageUploadHelper/awsUpload.single";
import { upload } from "../../../core/middlewares/imageUploadHelper/multer.config";
import validateRequest from "../../../core/middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidator } from "./category.validation";

const router = Router();

router.post(
  "/create",
  auth(USER_ROLE.ADMIN),
  upload.single("image"),
  validateRequest(categoryValidator.createCategoryValidationSchema),
  AwsUploadSingle("image"),
  categoryController.createCategory
);

router.put(
  "/update/:categoryId",
  auth(USER_ROLE.ADMIN),
  upload.single("image"),
  validateRequest(categoryValidator.updateCategoryValidationSchema),
  AwsUploadSingle("image"),
  categoryController.updateCategory
);
router.delete(
  "/delete/:categoryId",
  auth(USER_ROLE.ADMIN),
  categoryController.deleteCategory
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  categoryController.getCategory
);

export const categoryRouter = router;
