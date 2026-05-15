import { createHmac } from "node:crypto";

import { env } from "./env.js";

export type AuthRole = "shopper" | "admin";

export type AuthPayload = {
  sub: string;
  name: string;
  role: AuthRole;
  exp: number;
  iat: number;
};

type Header = {
  alg: "HS256";
  typ: "JWT";
};

const encodeBase64Url = (value: string): string => {
  return Buffer.from(value, "utf8").toString("base64url");
};

const decodeBase64Url = (value: string): string => {
  return Buffer.from(value, "base64url").toString("utf8");
};

const sign = (input: string): string => {
  return createHmac("sha256", env.JWT_SECRET).update(input).digest("base64url");
};

export const signAuthToken = (payload: Omit<AuthPayload, "iat" | "exp">, expiresInSeconds = 60 * 60 * 8): string => {
  const header: Header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: AuthPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(fullPayload));
  const signature = sign(`${encodedHeader}.${encodedPayload}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyAuthToken = (token: string): AuthPayload => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`);

  if (signature !== expectedSignature) {
    throw new Error("Invalid token signature");
  }

  const header = JSON.parse(decodeBase64Url(encodedHeader)) as Header;
  if (header.alg !== "HS256" || header.typ !== "JWT") {
    throw new Error("Invalid token header");
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AuthPayload;
  const now = Math.floor(Date.now() / 1000);

  if (!payload.exp || payload.exp <= now) {
    throw new Error("Token expired");
  }

  return payload;
};

export const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
};
