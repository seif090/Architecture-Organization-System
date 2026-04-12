import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || "postgres://erp_user:erp_pass@localhost:5432/erp_ar",
  jwtSecret: process.env.JWT_SECRET || "super_secret_change_me"
};
