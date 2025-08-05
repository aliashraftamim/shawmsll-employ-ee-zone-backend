import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { jobSearchTracker_controller } from "./jobSearchTracker.controller";
import { jobSearchTracker_validation } from "./jobSearchTracker.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(jobSearchTracker_validation.createJobSearchTracker),
  jobSearchTracker_controller.createJobSearchTracker
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  jobSearchTracker_controller.getAllJobSearchTracker
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  jobSearchTracker_controller.getJobSearchTrackerById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(jobSearchTracker_validation.updateJobSearchTracker),
  jobSearchTracker_controller.updateJobSearchTracker
);

router.delete("/:id", jobSearchTracker_controller.softDeleteJobSearchTracker);

export const jobSearchTracker_route = router;
