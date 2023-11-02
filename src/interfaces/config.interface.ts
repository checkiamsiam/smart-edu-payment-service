interface IConfig {
  isDevelopment: boolean;
  port: number | string;
  jwt: {
    secret: string;
  };
  redis: {
    url: string;
    expires_in: number | string;
  };
  ssl: {
    sslPaymentUrl: string;
    sslValidationUrl: string;
    storeId: string;
    storePassword: string;
  };
}

export default IConfig;
