import jwt from "jsonwebtoken";
import { ClinicianJwtPayload } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_EXPIRES_IN = "15m"; 
const REFRESH_EXPIRES_IN = "7d";

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  console.warn("JWT_SECRET or REFRESH_TOKEN_SECRET is not set. JWT generation will fail.");
}

// Generate Access Token
export function generateClinicianAccessToken(payload: ClinicianJwtPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

// Generate Refresh Token
export function generateClinicianRefreshToken(payload: ClinicianJwtPayload): string {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable is not configured");
  }
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

// Verify Refresh Token
export function verifyRefreshToken(token: string): ClinicianJwtPayload {
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable is not configured");
  }
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as ClinicianJwtPayload;
}
