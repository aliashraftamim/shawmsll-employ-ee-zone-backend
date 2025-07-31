import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadDocuments } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.multipleDoc";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { interviewPrep_controller } from "./interviewPrep.controller";
import { interviewPrep_validation } from "./interviewPrep.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(interviewPrep_validation.createInterviewPrep),
  AwsUploadDocuments("documents"),
  interviewPrep_controller.createInterviewPrep
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  interviewPrep_controller.getAllInterviewPrep
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  interviewPrep_controller.getInterviewPrepById
);

router.put(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(interviewPrep_validation.updateInterviewPrep),
  AwsUploadDocuments("documents"),
  interviewPrep_controller.updateInterviewPrep
);

router.delete("/:id", interviewPrep_controller.softDeleteInterviewPrep);

export const interviewPrep_route = router;
