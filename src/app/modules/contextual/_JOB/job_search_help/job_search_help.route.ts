import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import { upload } from "../../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
import { jobSearchHelp_controller } from "./job_search_help.controller";
import { jobSearchHelp_validation } from "./job_search_help.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.fields([
    { name: "documents", maxCount: 5 },
    { name: "icon", maxCount: 1 },
  ]),
  validateRequest(jobSearchHelp_validation.createJobSearchHelp),
  awsUpload.AwsUploader(
    {
      fieldName: "icon",
      isImage: true,
      multiple: false,
      required: true,
      maxSizeMB: 1,
    },
    {
      fieldName: "documents",
      isImage: false,
      multiple: true,
      required: true,
      maxSizeMB: 3,
    }
  ),
  jobSearchHelp_controller.createJobSearchHelp
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  jobSearchHelp_controller.getAllJobSearchHelp
);

router.get(
  "/single/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  jobSearchHelp_controller.getJobSearchHelpById
);

router.put(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  upload.fields([
    { name: "documents", maxCount: 5 },
    { name: "icon", maxCount: 1 },
  ]),
  validateRequest(jobSearchHelp_validation.updateJobSearchHelp),
  awsUpload.AwsUploader(
    {
      fieldName: "icon",
      isImage: true,
      multiple: false,
      required: false,
      maxSizeMB: 1,
    },
    {
      fieldName: "documents",
      isImage: false,
      multiple: true,
      required: false,
      maxSizeMB: 3,
    }
  ),
  jobSearchHelp_controller.updateJobSearchHelp
);

router.delete(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  jobSearchHelp_controller.softDeleteJobSearchHelp
);

export const jobSearchHelp_route = router;
