import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
  BILLING_STATUSES,
  LOCATION_OPTIONS,
} from "../types/appointmentTypes";
import { DATE_ONLY_RE } from "../controllers/analyticsController";

// Matches a plain YYYY-MM-DD with no time component

function isDateOnly(value: unknown): value is string {
  return typeof value === "string" && DATE_ONLY_RE.test(value);
}

function isISODate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return !Number.isNaN(new Date(value).getTime());
}

function isObjectId(value: unknown): boolean {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value);
}

export function validateAnalyticsQuery(req: Request, res: Response, next: NextFunction): void {
  const { startDate, endDate, status, clinicianId, patientId, appointmentType, location, billingStatus } = req.query;

  const errors: string[] = [];

  if (startDate !== undefined && !isISODate(startDate) && !isDateOnly(startDate)) {
    errors.push("startDate must be a valid date (YYYY-MM-DD) or ISO-8601 datetime");
  }
  if (endDate !== undefined && !isISODate(endDate) && !isDateOnly(endDate)) {
    errors.push("endDate must be a valid date (YYYY-MM-DD) or ISO-8601 datetime");
  }

  // Range check uses raw query values — both date-only and datetimes compare correctly via Date
  const normalizedStart = req.query.startDate as string | undefined;
  const normalizedEnd = req.query.endDate as string | undefined;
  if (
    typeof normalizedStart === "string" &&
    typeof normalizedEnd === "string" &&
    (isISODate(normalizedStart) || isDateOnly(normalizedStart)) &&
    (isISODate(normalizedEnd) || isDateOnly(normalizedEnd)) &&
    new Date(normalizedStart) > new Date(normalizedEnd)
  ) {
    errors.push("startDate must be earlier than or equal to endDate");
  }

  if (status !== undefined && !(APPOINTMENT_STATUSES as readonly string[]).includes(status as string)) {
    errors.push(`status must be one of: ${APPOINTMENT_STATUSES.join(", ")}`);
  }
  if (clinicianId !== undefined && !isObjectId(clinicianId)) {
    errors.push("clinicianId must be a valid ObjectId");
  }
  if (patientId !== undefined && !isObjectId(patientId)) {
    errors.push("patientId must be a valid ObjectId");
  }
  if (appointmentType !== undefined && !(APPOINTMENT_TYPES as readonly string[]).includes(appointmentType as string)) {
    errors.push(`appointmentType must be one of: ${APPOINTMENT_TYPES.join(", ")}`);
  }
  if (location !== undefined && !(LOCATION_OPTIONS as readonly string[]).includes(location as string)) {
    errors.push(`location must be one of: ${LOCATION_OPTIONS.join(", ")}`);
  }
  if (billingStatus !== undefined && !(BILLING_STATUSES as readonly string[]).includes(billingStatus as string)) {
    errors.push(`billingStatus must be one of: ${BILLING_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

// Same validation rules as the GET query but reads from req.body (POST /analytics/export)
export function validateAnalyticsExportBody(req: Request, res: Response, next: NextFunction): void {
  const { startDate, endDate, status, clinicianId, patientId, appointmentType, location, billingStatus } = req.body;

  const errors: string[] = [];

  if (startDate !== undefined && !isISODate(startDate) && !isDateOnly(startDate)) {
    errors.push("startDate must be a valid date (YYYY-MM-DD) or ISO-8601 datetime");
  }
  if (endDate !== undefined && !isISODate(endDate) && !isDateOnly(endDate)) {
    errors.push("endDate must be a valid date (YYYY-MM-DD) or ISO-8601 datetime");
  }
  if (
    typeof startDate === "string" &&
    typeof endDate === "string" &&
    (isISODate(startDate) || isDateOnly(startDate)) &&
    (isISODate(endDate) || isDateOnly(endDate)) &&
    new Date(startDate) > new Date(endDate)
  ) {
    errors.push("startDate must be earlier than or equal to endDate");
  }
  if (status !== undefined && !(APPOINTMENT_STATUSES as readonly string[]).includes(status)) {
    errors.push(`status must be one of: ${APPOINTMENT_STATUSES.join(", ")}`);
  }
  if (clinicianId !== undefined && !isObjectId(clinicianId)) {
    errors.push("clinicianId must be a valid ObjectId");
  }
  if (patientId !== undefined && !isObjectId(patientId)) {
    errors.push("patientId must be a valid ObjectId");
  }
  if (appointmentType !== undefined && !(APPOINTMENT_TYPES as readonly string[]).includes(appointmentType)) {
    errors.push(`appointmentType must be one of: ${APPOINTMENT_TYPES.join(", ")}`);
  }
  if (location !== undefined && !(LOCATION_OPTIONS as readonly string[]).includes(location)) {
    errors.push(`location must be one of: ${LOCATION_OPTIONS.join(", ")}`);
  }
  if (billingStatus !== undefined && !(BILLING_STATUSES as readonly string[]).includes(billingStatus)) {
    errors.push(`billingStatus must be one of: ${BILLING_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
