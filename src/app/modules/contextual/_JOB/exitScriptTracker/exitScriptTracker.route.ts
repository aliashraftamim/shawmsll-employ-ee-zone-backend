import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import { AwsUploadDocuments } from "../../../../core/middlewares/imageAndDocUploadHelper/awsUpload.multipleDoc";
import { upload } from "../../../../core/middlewares/imageAndDocUploadHelper/multer.config";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { exitScriptTracker_controller } from "./exitScriptTracker.controller";
import { exitScriptTracker_validation } from "./exitScriptTracker.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(exitScriptTracker_validation.createExitScriptTracker),
  AwsUploadDocuments("documents"),
  exitScriptTracker_controller.createExitScriptTracker
);

router.get("/", exitScriptTracker_controller.getAllExitScriptTracker);

router.get("/:id", exitScriptTracker_controller.getExitScriptTrackerById);

router.put(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  upload.fields([{ name: "documents", maxCount: 5 }]),
  validateRequest(exitScriptTracker_validation.updateExitScriptTracker),
  AwsUploadDocuments("documents"),
  exitScriptTracker_controller.updateExitScriptTracker
);

router.delete("/:id", exitScriptTracker_controller.softDeleteExitScriptTracker);

export const exitScriptTracker_route = router;
