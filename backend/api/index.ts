import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { initDb } from "../src/db";
import { router } from "../src/routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ERP API" });
});

app.use("/api", router);

let initPromise: Promise<void> | null = null;

function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDb().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  return initPromise;
}

export default async function handler(req: any, res: any) {
  try {
    await ensureDbInitialized();
    return app(req, res);
  } catch (error) {
    console.error("Database initialization failed", error);
    return res.status(500).json({ message: "Database initialization failed" });
  }
}
