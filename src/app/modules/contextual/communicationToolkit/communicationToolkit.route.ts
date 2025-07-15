import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { communicationToolkit_controller } from "./communicationToolkit.controller";
import { communicationToolkit_validation } from "./communicationToolkit.validation";

const router = Router();

// Create
router.post(
  "/",
  auth(USER_ROLE.SUPPER_ADMIN),
  validateRequest(communicationToolkit_validation.createCommunicationToolkit),
  communicationToolkit_controller.createToolkit
);

// Get all
router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.SUPPER_ADMIN),
  communicationToolkit_controller.getAllToolkit
);

// Update
router.patch(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  validateRequest(communicationToolkit_validation.updateCommunicationToolkit),
  communicationToolkit_controller.updateToolkit
);

// Soft delete
router.delete(
  "/:id",
  auth(USER_ROLE.SUPPER_ADMIN),
  communicationToolkit_controller.deleteToolkit
);

export const communicationToolkit_routes = router;
