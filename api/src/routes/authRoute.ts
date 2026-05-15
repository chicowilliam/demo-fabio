import { Router } from "express";
import { randomUUID } from "node:crypto";
import * as z from "zod";

import type { AuthRole } from "../utils/auth.js";
import { signAuthToken } from "../utils/auth.js";
import { env } from "../utils/env.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import { requireAuth } from "../middlewares/auth.js";

export const authRouter = Router();

const loginSchema = z.object({
  name: z.string().trim().min(1).max(80),
  role: z.enum(["shopper", "admin"]).optional(),
  adminCode: z.string().trim().min(1).optional(),
});

authRouter.post("/login", (request, response) => {
  const body = loginSchema.parse(request.body);

  const role: AuthRole = body.role ?? "shopper";
  if (role === "admin") {
    if (!env.ADMIN_ACCESS_CODE || body.adminCode !== env.ADMIN_ACCESS_CODE) {
      return response.status(403).json({ message: "Admin access denied" });
    }
  }

  const user = {
    id: randomUUID(),
    name: body.name,
    role,
  };

  const token = signAuthToken({
    sub: user.id,
    name: user.name,
    role: user.role,
  });

  return response.json({ token, user });
});

authRouter.get("/me", requireAuth(["shopper", "admin"]), (request: AuthenticatedRequest, response) => {
  return response.json({ user: request.authUser });
});
