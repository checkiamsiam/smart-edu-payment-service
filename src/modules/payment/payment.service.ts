import { Payment, PaymentStatus, Prisma } from "@prisma/client";
import prismaHelper from "../../helpers/prisma.helper";
import {
  IQueryFeatures,
  IQueryResult,
} from "../../interfaces/queryFeatures.interface";
import prisma from "../../shared/prismaClient";
import SSLServices from "../ssl/ssl.services";

const getPayments = async (
  queryFeatures: IQueryFeatures
): Promise<IQueryResult<Payment>> => {
  const whereConditions: Prisma.PaymentWhereInput =
    prismaHelper.findManyQueryHelper<Prisma.PaymentWhereInput>(queryFeatures, {
      searchFields: ["amount", "transactionId", "studentId"],
    });

  const query: Prisma.PaymentFindManyArgs = {
    where: whereConditions,
    skip: queryFeatures.skip,
    take: queryFeatures.limit,
    orderBy: queryFeatures.sort,
  };

  if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
    query.select = { id: true, ...queryFeatures.fields };
  }

  const [result, count] = await prisma.$transaction([
    prisma.payment.findMany(query),
    prisma.payment.count({ where: whereConditions }),
  ]);

  return {
    data: result,
    total: count,
  };
};

const getSinglePayment = async (
  id: string,
  queryFeatures: IQueryFeatures
): Promise<Partial<Payment> | null> => {
  const query: Prisma.PaymentFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (queryFeatures.fields && Object.keys(queryFeatures.fields).length > 0) {
    query.select = { id: true, ...queryFeatures.fields };
  }

  const result: Partial<Payment> | null = await prisma.payment.findUnique(
    query
  );

  return result;
};

const initPayment = async (data: any): Promise<string> => {
  const paymentSession = await SSLServices.initPayment({
    total_amount: data.amount,
    tran_id: data.transactionId,
    cus_name: data.studentName,
    cus_email: data.studentEmail,
    cus_add1: data.address,
    cus_phone: data.phone,
  });

  await prisma.payment.create({
    data: {
      amount: data.amount,
      transactionId: data.transactionId,
      studentId: data.studentId,
    },
  });
  return paymentSession.redirectGatewayURL;
};

const webhook = async (payload: any) => {
  if (!payload || !payload?.status || payload?.status !== "VALID") {
    return {
      massage: "Invalid Payment!",
    };
  }
  const result = await SSLServices.validate(payload);

  if (result?.status !== "VALID") {
    return {
      massage: "Payment failed",
    };
  }

  const { tran_id } = result;
  await prisma.payment.updateMany({
    where: {
      transactionId: tran_id,
    },
    data: {
      status: PaymentStatus.PAID,
      paymentGatewayData: payload,
    },
  });

  return {
    massage: "Payment Success",
  };
};

const paymentService = {
  getPayments,
  getSinglePayment,
  initPayment,
  webhook,
};

export default paymentService;
