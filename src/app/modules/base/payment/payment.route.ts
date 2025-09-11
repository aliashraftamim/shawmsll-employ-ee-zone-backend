import { Router } from "express";
import { payment_controller } from "./payment.controller";
import { payment_validation } from "./payment.validation";

const router = Router();

router.post("/", 
auth(USER_ROLE.USER),  upload.single("image") ,   validateRequest( payment_validation.createPayment),  AwsUploadSingle("image"),  payment_controller.createPayment);

router.get("/", auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN), payment_controller.getAllPayment);

router.get("/:id", auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPPER_ADMIN), payment_controller.getPaymentById);

router.put("/:id", auth(USER_ROLE.USER),  upload.single("image") ,   validateRequest( payment_validation.updatePayment),  AwsUploadSingle("image"), payment_controller.updatePayment);

router.delete("/:id", payment_controller.softDeletePayment);

export const payment_route = router;
