import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "db",
    port: parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_NAME || "incorpfirm",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "pwd",
  },
  api: {
    url: process.env.API_URL || "http://localhost:3000",
  },
};
