import dotenv from "dotenv";
import IConfig from "../interfaces/config.interface";

dotenv.config();

const config: IConfig = {
  isDevelopment: process.env.NODE_ENV === "development",
  port: process.env.PORT || 5003,
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    expires_in: process.env.REDIS_EXPIRES_IN || "3600",
  },
  ssl: {
    sslPaymentUrl: process.env.SSL_PAYMENT_URL as string,
    sslValidationUrl: process.env.SSL_VALIDATION_URL as string,
    storeId: process.env.SSL_STORE_ID as string,
    storePassword: process.env.SSL_STORE_PASSWORD as string,
  },
};

export default config;
