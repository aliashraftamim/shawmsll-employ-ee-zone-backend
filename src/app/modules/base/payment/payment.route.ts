import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import { upload } from "../../../core/middlewares/!awsUploader/multer.config";
import auth from "../../../core/middlewares/auth";
import { payment_controller } from "./payment.controller";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),

  payment_controller.createPayment
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  payment_controller.getAllPayment
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  payment_controller.getPaymentById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  upload.single("image"),

  payment_controller.updatePayment
);

router.delete("/:id", payment_controller.softDeletePayment);

export const payment_route = router;
