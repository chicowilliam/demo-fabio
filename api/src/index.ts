import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Prisma } from "@prisma/client";
import * as z from "zod";

import { env } from "./utils/env.js";
import { supermarketRouter } from "./routes/supermarketRoute.js";
import { prisma } from "./utils/prisma.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", async (_request, response) => {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    response.json({ status: "ok", db: "up", uptime: process.uptime() });
  } catch (_error) {
    response.status(503).json({ status: "degraded", db: "down", uptime: process.uptime() });
  }
});

app.use("/api/supermarkets", supermarketRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found" });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    return response.status(400).json({ message: "Invalid request", issues: error.issues });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return response.status(400).json({ message: "Database request failed", code: error.code });
  }

  console.error("Unhandled API error:", error);
  response.status(500).json({ message: "Internal server error" });
});

const server = app.listen(env.PORT, () => {
  console.log(`API listening on port ${env.PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
