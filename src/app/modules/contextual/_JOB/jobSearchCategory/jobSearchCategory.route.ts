import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import { upload } from "../../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
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
  // AwsUploadDocImg(
  //   {
  //     fieldName: "image",
  //     isImage: true,
  //     multiple: false,
  //   },
  //   {
  //     fieldName: "document",
  //     isImage: false,
  //     multiple: false,
  //   }
  // )
  awsUpload.AwsUploader(
    {
      fieldName: "image",
      isImage: true,
      multiple: false,
      required: false,
      maxSizeMB: 10,
    },
    {
      fieldName: "document",
      isImage: false,
      multiple: false,
      required: false,
      maxSizeMB: 10,
    }
  ),
  jobSearchCategory_controller.createJobSearchCategory
);

router.get("/", jobSearchCategory_controller.getAllJobSearchCategory);

router.get("/:id", jobSearchCategory_controller.getJobSearchCategoryById);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateRequest(jobSearchCategoryValidation.updateJobSearchCategory),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  jobSearchCategory_controller.updateJobSearchCategory
);

router.delete("/:id", jobSearchCategory_controller.softDeleteJobSearchCategory);

export const jobSearchCategoryRoute = router;
