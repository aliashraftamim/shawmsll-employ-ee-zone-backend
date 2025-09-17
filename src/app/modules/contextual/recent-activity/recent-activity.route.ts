import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { recentActivity_controller } from "./recent-activity.controller";
import { recentActivity_validation } from "./recent-activity.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(recentActivity_validation.createRecentActivity),
  recentActivity_controller.createRecentActivity
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  recentActivity_controller.getAllRecentActivity
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  recentActivity_controller.getRecentActivityById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(recentActivity_validation.updateRecentActivity),
  recentActivity_controller.updateRecentActivity
);

router.delete("/:id", recentActivity_controller.softDeleteRecentActivity);

export const recentActivity_route = router;
