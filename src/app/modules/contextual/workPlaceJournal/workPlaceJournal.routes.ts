import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { workPlaceJournal_controller } from "./workPlaceJournal.controller";
import { workPlaceJournal_validation } from "./workPlaceJournal.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(workPlaceJournal_validation.createWorkplaceJournal),
  workPlaceJournal_controller.createWorksJournal
);

export const workPlaceJournal_routes = router;
