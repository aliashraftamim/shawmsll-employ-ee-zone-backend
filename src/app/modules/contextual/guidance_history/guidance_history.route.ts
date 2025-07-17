import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { GuidanceHistoryController } from "./guidance_history.controller";
import { guidance_history_validation } from "./guidance_history.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(guidance_history_validation.createGuidanceHistory),
  GuidanceHistoryController.create
);
router.get(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(guidance_history_validation.updateGuidanceHistory),
  GuidanceHistoryController.getAll
);
router.get("/:id", auth(USER_ROLE.USER), GuidanceHistoryController.getById);
router.put("/:id", auth(USER_ROLE.USER), GuidanceHistoryController.update);
router.delete(
  "/:id",
  auth(USER_ROLE.USER),
  GuidanceHistoryController.softDelete
);

export const guidance_history_route = router;
