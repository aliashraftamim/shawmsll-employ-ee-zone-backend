import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { guidanceSuggestion_controller } from "./guidance_suggestion.controller";
import { guidanceSuggestion_validation } from "./guidance_suggestion.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  validateRequest(guidanceSuggestion_validation.createGuidanceSuggestion),
  guidanceSuggestion_controller.createGuidanceSuggestion
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  guidanceSuggestion_controller.getAllGuidanceSuggestion
);

router.get(
  "/get-by-category-and-scenario",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  guidanceSuggestion_controller.guidanceSuggestionByCategoryAndScenario
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  guidanceSuggestion_controller.getGuidanceSuggestionById
);

router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  validateRequest(guidanceSuggestion_validation.updateGuidanceSuggestion),
  guidanceSuggestion_controller.updateGuidanceSuggestion
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  guidanceSuggestion_controller.softDeleteGuidanceSuggestion
);

export const guidanceSuggestion_route = router;
