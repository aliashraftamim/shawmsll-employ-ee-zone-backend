import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { scheduleType_controller } from "./scheduleType.controller";
import { scheduleType_validation } from "./scheduleType.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  validateRequest(scheduleType_validation.createScheduleType),
  scheduleType_controller.createScheduleType
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.HR, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  scheduleType_controller.getAllScheduleType
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.HR, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  scheduleType_controller.getScheduleTypeById
);

router.put(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  validateRequest(scheduleType_validation.updateScheduleType),
  scheduleType_controller.updateScheduleType
);

router.delete(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  scheduleType_controller.softDeleteScheduleType
);

export const scheduleType_route = router;
