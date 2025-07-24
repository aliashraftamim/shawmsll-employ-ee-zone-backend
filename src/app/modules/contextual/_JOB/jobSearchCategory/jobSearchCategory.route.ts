import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.single";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { jobSearchCategory_controller } from "./jobSearchCategory.controller";
import { jobSearchCategoryValidation } from "./jobSearchCategory.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(jobSearchCategoryValidation.createJobSearchCategory),
  AwsUploadSingle("image"),
  jobSearchCategory_controller.createJobSearchCategory
);

router.get("/", jobSearchCategory_controller.getAllJobSearchCategory);

router.get("/:id", jobSearchCategory_controller.getJobSearchCategoryById);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(jobSearchCategoryValidation.updateJobSearchCategory),
  AwsUploadSingle("image"),
  jobSearchCategory_controller.updateJobSearchCategory
);

router.delete("/:id", jobSearchCategory_controller.softDeleteJobSearchCategory);

export const jobSearchCategoryRoute = router;
