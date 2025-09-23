import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { guidance_controller } from "./guidance.controller";
import { guidance_validation } from "./guidance.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(guidance_validation.createGuidance),
  guidance_controller.createGuidance
);

router.get("/", auth(USER_ROLE.USER), guidance_controller.getAllGuidance);

router.get("/:id", auth(USER_ROLE.USER), guidance_controller.getSingleGuidance);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(guidance_validation.updateGuidance),
  guidance_controller.updateGuidance
);

router.delete("/:id", auth(USER_ROLE.USER), guidance_controller.deleteGuidance);

export const guidance_routes = router;
