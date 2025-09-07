import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { specialistSchedule_controller } from "./specialist_schedule.controller";
import { specialistSchedule_validation } from "./specialist_schedule.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(specialistSchedule_validation.createSpecialistSchedule),
  specialistSchedule_controller.createSpecialistSchedule
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  specialistSchedule_controller.getAllSpecialistSchedule
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  specialistSchedule_controller.getSpecialistScheduleById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  validateRequest(specialistSchedule_validation.updateSpecialistSchedule),
  specialistSchedule_controller.updateSpecialistSchedule
);

router.delete(
  "/:id",
  specialistSchedule_controller.softDeleteSpecialistSchedule
);

export const specialistSchedule_route = router;
