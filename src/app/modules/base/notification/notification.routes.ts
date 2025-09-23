import { Router } from "express";

import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import { notificationController } from "./notification.controller";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN, USER_ROLE.ADMIN),
  notificationController.getAllNotification
);

router.put(
  "/make-read",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN, USER_ROLE.USER),
  notificationController.makeRead
);

router.put(
  "/mark-all-read",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN, USER_ROLE.USER),
  notificationController.markAllMyNotificationRead
);

router.delete(
  "/delete/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN, USER_ROLE.USER),
  notificationController.deleteNotification
);

export const notificationRoute = router;
