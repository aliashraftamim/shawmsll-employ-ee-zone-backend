import { Router } from "express";
import { USER_ROLE } from "../../../core/constants/global.constants";
import auth from "../../../core/middlewares/auth";
import validateRequest from "../../../core/middlewares/validateRequest";
import { bookmark_controller } from "./bookmark.controller";
import { bookmark_validation } from "./bookmark.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.USER),
  validateRequest(bookmark_validation.createBookmark),
  bookmark_controller.createBookmark
);

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  bookmark_controller.getAllBookmark
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  bookmark_controller.getBookmarkById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(bookmark_validation.updateBookmark),
  bookmark_controller.updateBookmark
);

router.delete("/:id", bookmark_controller.softDeleteBookmark);

export const bookmark_route = router;
