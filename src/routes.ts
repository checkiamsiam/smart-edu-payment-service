import express, { Router } from "express";
import paymentRoute from "./modules/payment/payment.route";

const router: Router = express.Router();

const routes: { path: string; route: Router }[] = [
  {
    path: "/payment",
    route: paymentRoute,
  },
  
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
