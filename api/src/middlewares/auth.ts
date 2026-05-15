import type { NextFunction, Request, Response } from "express";

import { extractBearerToken, type AuthPayload, type AuthRole, verifyAuthToken } from "../utils/auth.js";

export type AuthenticatedRequest = Request & {
  authUser?: AuthPayload;
};

export const requireAuth = (allowedRoles?: AuthRole[]) => {
  return (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const token = extractBearerToken(request.header("authorization"));

    if (!token) {
      return response.status(401).json({ message: "Missing authorization token" });
    }

    try {
      const payload = verifyAuthToken(token);

      if (allowedRoles && !allowedRoles.includes(payload.role)) {
        return response.status(403).json({ message: "Insufficient permissions" });
      }

      request.authUser = payload;
      return next();
    } catch (_error) {
      return response.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
