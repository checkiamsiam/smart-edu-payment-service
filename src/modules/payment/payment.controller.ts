import { Payment } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsyncErrors from "../../utils/catchAsyncError.util";
import AppError from "../../utils/customError.util";
import sendResponse from "../../utils/sendResponse.util";
import paymentService from "./payment.service";

const getPayments: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const getResult = await paymentService.getPayments(req.queryFeatures);
    sendResponse<Partial<Payment>[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: getResult.data,
      meta: {
        page: req.queryFeatures.page,
        limit: req.queryFeatures.limit,
        total: getResult.total || 0,
      },
    });
  }
);

const getSinglePayment: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const result: Partial<Payment> | null =
      await paymentService.getSinglePayment(id, req.queryFeatures);
    if (!result) {
      throw new AppError("Semester Not Found", httpStatus.NOT_FOUND);
    }
    sendResponse<Partial<Payment>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  }
);

const initPayment: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await paymentService.initPayment(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment successfully",
      data: result,
    });
  }
);
const webhook: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const result = await paymentService.webhook(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment verified!",
      data: result,
    });
  }
);

const paymentController = {
  getPayments,
  getSinglePayment,
  initPayment,
  webhook,
};
export default paymentController;
