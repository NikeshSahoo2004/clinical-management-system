import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUSES,
  BILLING_STATUSES,
  LOCATION_OPTIONS,
  MAX_DURATION,
} from "../types/appointmentTypes";

function isObjectId(val: unknown): boolean {
  return typeof val === "string" && mongoose.Types.ObjectId.isValid(val);
}

function isISODate(val: unknown): boolean {
  if (typeof val !== "string") return false;
  return !isNaN(new Date(val).getTime());
}

function isFutureDate(val: string): boolean {
  return new Date(val) >= new Date();
}

function validateBillingFields(billing: Record<string, any>, errors: string[]): void {
  if (billing.amount !== undefined) {
    if (typeof billing.amount !== "number" || billing.amount < 0) {
      errors.push("billing.amount must be a non-negative number");
    }
  }
  if (billing.status !== undefined) {
    if (!(BILLING_STATUSES as readonly string[]).includes(billing.status)) {
      errors.push(`billing.status must be one of: ${BILLING_STATUSES.join(", ")}`);
    }
  }
  if (billing.insuranceDetails !== undefined) {
    if (typeof billing.insuranceDetails !== "object" || billing.insuranceDetails === null) {
      errors.push("billing.insuranceDetails must be an object");
    } else {
      const ins = billing.insuranceDetails;
      if (ins.provider !== undefined && ins.provider !== null && typeof ins.provider !== "string") {
        errors.push("billing.insuranceDetails.provider must be a string or null");
      }
      if (ins.policyNumber !== undefined && ins.policyNumber !== null && typeof ins.policyNumber !== "string") {
        errors.push("billing.insuranceDetails.policyNumber must be a string or null");
      }
    }
  }
}

export function validateCreateAppointment(req: Request, res: Response, next: NextFunction): void {
  const { patientId, clinicianId, appointmentType, status, scheduledAt, duration, location, notes, billing } = req.body;
  const errors: string[] = [];

  if (!patientId || !isObjectId(patientId)) {
    errors.push("patientId is required and must be a valid ObjectId");
  }
  if (!clinicianId || !isObjectId(clinicianId)) {
    errors.push("clinicianId is required and must be a valid ObjectId");
  }
  if (!appointmentType || !(APPOINTMENT_TYPES as readonly string[]).includes(appointmentType)) {
    errors.push(`appointmentType is required and must be one of: ${APPOINTMENT_TYPES.join(", ")}`);
  }
  if (status !== undefined && !(APPOINTMENT_STATUSES as readonly string[]).includes(status)) {
    errors.push(`status must be one of: ${APPOINTMENT_STATUSES.join(", ")}`);
  }
  if (!scheduledAt || !isISODate(scheduledAt)) {
    errors.push("scheduledAt is required and must be a valid ISO-8601 date string");
  } else if (!isFutureDate(scheduledAt)) {
    errors.push("scheduledAt must be a current or future date/time");
  }
  if (duration === undefined || typeof duration !== "number" || duration < 5) {
    errors.push("duration is required and must be at least 5 minutes");
  } else if (duration > MAX_DURATION) {
    errors.push(`duration must not exceed ${MAX_DURATION} minutes`);
  }
  if (!location || !(LOCATION_OPTIONS as readonly string[]).includes(location)) {
    errors.push(`location is required and must be one of: ${LOCATION_OPTIONS.join(", ")}`);
  }
  if (notes !== undefined && typeof notes !== "string") {
    errors.push("notes must be a string");
  }
  if (billing !== undefined) {
    if (typeof billing !== "object" || billing === null) {
      errors.push("billing must be an object");
    } else {
      validateBillingFields(billing, errors);
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export function validateUpdateAppointment(req: Request, res: Response, next: NextFunction): void {
  const { patientId, clinicianId, appointmentType, status, scheduledAt, duration, location, notes, billing } = req.body;
  const errors: string[] = [];

  if (patientId !== undefined && !isObjectId(patientId)) {
    errors.push("patientId must be a valid ObjectId");
  }
  if (clinicianId !== undefined && !isObjectId(clinicianId)) {
    errors.push("clinicianId must be a valid ObjectId");
  }
  if (appointmentType !== undefined && !(APPOINTMENT_TYPES as readonly string[]).includes(appointmentType)) {
    errors.push(`appointmentType must be one of: ${APPOINTMENT_TYPES.join(", ")}`);
  }
  if (status !== undefined && !(APPOINTMENT_STATUSES as readonly string[]).includes(status)) {
    errors.push(`status must be one of: ${APPOINTMENT_STATUSES.join(", ")}`);
  }
  if (scheduledAt !== undefined) {
    if (!isISODate(scheduledAt)) {
      errors.push("scheduledAt must be a valid ISO-8601 date string");
    } else if (!isFutureDate(scheduledAt)) {
      errors.push("scheduledAt must be a current or future date/time");
    }
  }
  if (duration !== undefined) {
    if (typeof duration !== "number" || duration < 5) {
      errors.push("duration must be at least 5 minutes");
    } else if (duration > MAX_DURATION) {
      errors.push(`duration must not exceed ${MAX_DURATION} minutes`);
    }
  }
  if (location !== undefined && !(LOCATION_OPTIONS as readonly string[]).includes(location)) {
    errors.push(`location must be one of: ${LOCATION_OPTIONS.join(", ")}`);
  }
  if (notes !== undefined && typeof notes !== "string") {
    errors.push("notes must be a string");
  }
  if (billing !== undefined) {
    if (typeof billing !== "object" || billing === null) {
      errors.push("billing must be an object");
    } else {
      validateBillingFields(billing, errors);
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export function validateStatusUpdate(req: Request, res: Response, next: NextFunction): void {
  const { status } = req.body;
  const errors: string[] = [];

  if (!status || !(APPOINTMENT_STATUSES as readonly string[]).includes(status)) {
    errors.push(`status is required and must be one of: ${APPOINTMENT_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export function validateIdParam(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id as string;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid appointment ID. Must be a valid MongoDB ObjectId." });
    return;
  }
  next();
}
