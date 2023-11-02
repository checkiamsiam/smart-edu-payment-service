import express, { Router } from "express";
import { userRoleEnum } from "../../constants/userRole.enum";
import authorization from "../../middleware/authorization.middleware";
import queryFeatures from "../../middleware/queryFeatures.middleware";
import paymentController from "./payment.controller";

const paymentRoute: Router = express.Router();

paymentRoute.get(
  "/",
  authorization(userRoleEnum.admin, userRoleEnum.superAdmin),
  queryFeatures("multiple"),
  paymentController.getPayments
);

paymentRoute.get(
  "/:id",
  authorization(userRoleEnum.admin, userRoleEnum.superAdmin),
  queryFeatures("single"),
  paymentController.getSinglePayment
);

paymentRoute.post("/init", paymentController.initPayment);

paymentRoute.post("/webhook", paymentController.webhook);

export default paymentRoute;
