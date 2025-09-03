import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { AwsUploadDocImg } from "../../../core/middlewares/!awsUploader/awsUploadDocImg";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { hrAdmin_controller } from "./hr-admin.controller";
import { hrAdmin_validation } from "./hr-admin.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.fields([
    { name: "documents", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  validateRequest(hrAdmin_validation.createHrAdmin),
  AwsUploadDocImg(
    { fieldName: "profileImage", isImage: true, multiple: false },
    { fieldName: "documents", isImage: false, multiple: false }
  ),
  hrAdmin_controller.createHrAdmin
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  hrAdmin_controller.getAllHrAdmin
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  hrAdmin_controller.getHrAdminById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.fields([
    { name: "documents", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  validateRequest(hrAdmin_validation.updateHrAdmin),
  AwsUploadDocImg(
    { fieldName: "profileImage", isImage: true, multiple: false },
    { fieldName: "documents", isImage: false, multiple: false }
  ),
  hrAdmin_controller.updateHrAdmin
);

router.delete("/:id", hrAdmin_controller.softDeleteHrAdmin);

export const hrAdmin_route = router;
