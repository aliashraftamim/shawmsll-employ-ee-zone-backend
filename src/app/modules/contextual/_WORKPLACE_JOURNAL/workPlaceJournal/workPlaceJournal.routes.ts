import { Router } from "express";
import { USER_ROLE } from "../../../../core/constants/global.constants";
import auth from "../../../../core/middlewares/auth";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { workPlaceJournal_controller } from "./workPlaceJournal.controller";
import { workPlaceJournal_validation } from "./workPlaceJournal.validation";

const router = Router();

// ✅ Create
router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(workPlaceJournal_validation.createWorkplaceJournal),
  workPlaceJournal_controller.createWorksJournal
);

// ✅ Get All (filtered, paginated, etc.)
router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  workPlaceJournal_controller.getWorkplaceJournal
);

router.get(
  "/single/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  workPlaceJournal_controller.getSingleWorkplaceJournal
);

// ✅ Update
router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(workPlaceJournal_validation.updateWorkplaceJournal),
  workPlaceJournal_controller.updateWorkplaceJournal
);

// ✅ Soft Delete
router.delete(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  workPlaceJournal_controller.deleteWorkplaceJournal
);

export const workPlaceJournal_routes = router;
