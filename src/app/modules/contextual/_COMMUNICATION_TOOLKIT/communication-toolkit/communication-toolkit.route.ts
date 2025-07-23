import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { communicationToolkit_controller } from "./communication-toolkit.controller";
import { communicationToolkitValidation } from "./communication-toolkit.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(communicationToolkitValidation.createCommunicationToolkit),
  communicationToolkit_controller.createCommunicationToolkit
);

router.get("/", communicationToolkit_controller.getAllCommunicationToolkit);

router.get("/:id", communicationToolkit_controller.getCommunicationToolkitById);

router.put("/:id", communicationToolkit_controller.updateCommunicationToolkit);

router.delete(
  "/:id",
  communicationToolkit_controller.softDeleteCommunicationToolkit
);

export const communicationToolkitRoute = router;
