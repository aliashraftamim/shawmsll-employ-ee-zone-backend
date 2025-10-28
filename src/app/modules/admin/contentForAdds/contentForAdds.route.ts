import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { awsUpload } from "../../../toolkit/classes/AWS_UPLOAD_ANY_FILE/aws.upload";
import { contentForAdds_controller } from "./contentForAdds.controller";
import { contentForAdds_validation } from "./contentForAdds.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateRequest(contentForAdds_validation.createContentForAdds),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  contentForAdds_controller.createContentForAdds
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  contentForAdds_controller.getAllContentForAdds
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  contentForAdds_controller.getContentForAddsById
);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  upload.fields([{ name: "image", maxCount: 1 }]),
  validateRequest(contentForAdds_validation.updateContentForAdds),
  awsUpload.AwsUploader({
    fieldName: "image",
    isImage: true,
    multiple: false,
    required: false,
    maxSizeMB: 10,
  }),
  contentForAdds_controller.updateContentForAdds
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  contentForAdds_controller.deleteContentForAdds
);

export const contentForAdds_route = router;
