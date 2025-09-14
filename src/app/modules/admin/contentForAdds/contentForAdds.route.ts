import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { AwsUploadSingle } from "../../../core/middlewares/!awsUploader/awsUpload.single";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { contentForAdds_controller } from "./contentForAdds.controller";
import { contentForAdds_validation } from "./contentForAdds.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(contentForAdds_validation.createContentForAdds),
  AwsUploadSingle("image"),
  contentForAdds_controller.createContentForAdds
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  contentForAdds_controller.getAllContentForAdds
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  contentForAdds_controller.getContentForAddsById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.single("image"),
  validateRequest(contentForAdds_validation.updateContentForAdds),
  AwsUploadSingle("image"),
  contentForAdds_controller.updateContentForAdds
);

router.delete("/:id", contentForAdds_controller.softDeleteContentForAdds);

export const contentForAdds_route = router;
