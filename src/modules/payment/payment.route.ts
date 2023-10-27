import express, { Router } from "express";
import paymentController from "./payment.controller";

const paymentRoute: Router = express.Router();

paymentRoute.post(
  "/init",
  paymentController.initPayment
);


export default paymentRoute;
