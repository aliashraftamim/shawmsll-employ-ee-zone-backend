import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadSingle } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.single";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { jobSearchTracker_controller } from "./jobSearchTracker.controller";
import { jobSearchTracker_validation } from "./jobSearchTracker.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(jobSearchTracker_validation.createJobSearchTracker),
  AwsUploadSingle("image"),
  jobSearchTracker_controller.createJobSearchTracker
);

router.get("/", jobSearchTracker_controller.getAllJobSearchTracker);

router.get("/:id", jobSearchTracker_controller.getJobSearchTrackerById);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(jobSearchTracker_validation.updateJobSearchTracker),
  AwsUploadSingle("image"),
  jobSearchTracker_controller.updateJobSearchTracker
);

router.delete("/:id", jobSearchTracker_controller.softDeleteJobSearchTracker);

export const jobSearchTracker_route = router;
