import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import sendResponse from "../../utils/sendResponse.util";
import paymentService from "./payment.service";

const initPayment : RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await paymentService.initPayment();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment successfully",
    });
  }
);

const paymentController = {
  initPayment
};
export default paymentController;
