import { Router } from "express";
import { USER_ROLE } from "../../../../../core/constants/global.constants";
import auth from "../../../../../core/middlewares/auth";
import validateRequest from "../../../../../core/middlewares/validateRequest";
import { transaction_controller } from "./transaction.controller";
import { transaction_validation } from "./transaction.validation";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  transaction_controller.getAllTransaction
);

router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN),
  transaction_controller.getTransactionById
);

router.put(
  "/:id",
  auth(USER_ROLE.USER),
  validateRequest(transaction_validation.updateTransaction),
  transaction_controller.updateTransaction
);

router.delete("/:id", transaction_controller.softDeleteTransaction);

export const transaction_route = router;
