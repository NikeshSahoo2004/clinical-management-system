import jwt from "jsonwebtoken";
import { ClinicianJwtPayload } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  // Fail fast on startup misconfiguration
  // (server.ts will import this module as part of the app bootstrap)
  console.warn("JWT_SECRET is not set. JWT generation will fail until it is configured.");
}

export function generateClinicianToken(payload: ClinicianJwtPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

