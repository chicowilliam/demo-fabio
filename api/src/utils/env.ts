import "dotenv/config";

import * as z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_DATABASE_URL: z.string().min(1).optional(),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(16).default("demo-market-super-secret-dev-key"),
  ADMIN_ACCESS_CODE: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
