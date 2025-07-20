import { Router } from "express";
import validateRequest from "../../../../core/middlewares/validateRequest";
import { tags_controller } from "./tags.controller";
import { tagsValidation } from "./tags.validation";

const router = Router();

router.post(
  "/",
  validateRequest(tagsValidation.createTags),
  tags_controller.createTags
);
router.get("/", tags_controller.getAllTags);
router.get("/:id", tags_controller.getTagsById);
router.patch("/:id", tags_controller.updateTags);
router.delete("/:id", tags_controller.softDeleteTags);

export const tagsRoute = router;
