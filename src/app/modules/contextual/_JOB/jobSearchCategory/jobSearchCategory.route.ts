import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import { AwsUploadSingle } from "../../../../core/middlewares/!awsUploader/awsUpload.single";
import { AwsUploadDocImg } from "../../../../core/middlewares/!awsUploader/awsUploadDocImg";
import { upload } from "../../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { jobSearchCategory_controller } from "./jobSearchCategory.controller";
import { jobSearchCategoryValidation } from "./jobSearchCategory.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  // Validate the request body against
  validateRequest(jobSearchCategoryValidation.createJobSearchCategory),
  AwsUploadDocImg(
    {
      fieldName: "image",
      isImage: true,
      multiple: false,
    },
    {
      fieldName: "document",
      isImage: false,
      multiple: false,
    }
  ),
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
