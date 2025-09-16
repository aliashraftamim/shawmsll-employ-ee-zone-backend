import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { topUsedTools_controller } from "./top-used-tools.controller";
import { topUsedTools_validation } from "./top-used-tools.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(topUsedTools_validation.createTopUsedTools),
  topUsedTools_controller.createTopUsedTools
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  topUsedTools_controller.getAllTopUsedTools
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  topUsedTools_controller.getTopUsedToolsById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(topUsedTools_validation.updateTopUsedTools),
  topUsedTools_controller.updateTopUsedTools
);

router.delete("/:id", topUsedTools_controller.softDeleteTopUsedTools);

export const topUsedTools_route = router;
