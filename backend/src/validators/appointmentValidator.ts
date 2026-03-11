import { Request, Response, NextFunction } from "express";
import { isValidDate, isValidTime, isFutureDate } from "../utils/dateUtils";
import { AppointmentStatus } from "../types/appointmentTypes";
import mongoose from "mongoose";

const VALID_STATUSES: AppointmentStatus[] = ["scheduled", "completed", "cancelled", "no-show"];

export function validateCreateAppointment(req: Request, res: Response, next: NextFunction): void {
  const { patient_name, doctor_name, appointment_date, appointment_time, status, reason } =
    req.body;

  const errors: string[] = [];

  if (!patient_name || typeof patient_name !== "string" || patient_name.trim().length === 0) {
    errors.push("patient_name is required and must be a non-empty string");
  }
  if (!doctor_name || typeof doctor_name !== "string" || doctor_name.trim().length === 0) {
    errors.push("doctor_name is required and must be a non-empty string");
  }
  if (!appointment_date || !isValidDate(appointment_date)) {
    errors.push("appointment_date is required and must be in YYYY-MM-DD format");
  } else if (!isFutureDate(appointment_date)) {
    errors.push("appointment_date must be today or a future date");
  }
  if (!appointment_time || !isValidTime(appointment_time)) {
    errors.push("appointment_time is required and must be in HH:MM (24-hour) format");
  }
  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
    errors.push("reason is required and must be a non-empty string");
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateUpdateAppointment(req: Request, res: Response, next: NextFunction): void {
  const { patient_name, doctor_name, appointment_date, appointment_time, status, reason } =
    req.body;

  const errors: string[] = [];

  if (patient_name !== undefined && (typeof patient_name !== "string" || patient_name.trim().length === 0)) {
    errors.push("patient_name must be a non-empty string");
  }
  if (doctor_name !== undefined && (typeof doctor_name !== "string" || doctor_name.trim().length === 0)) {
    errors.push("doctor_name must be a non-empty string");
  }
  if (appointment_date !== undefined) {
    if (!isValidDate(appointment_date)) {
      errors.push("appointment_date must be in YYYY-MM-DD format");
    } else if (!isFutureDate(appointment_date)) {
      errors.push("appointment_date must be today or a future date");
    }
  }
  if (appointment_time !== undefined && !isValidTime(appointment_time)) {
    errors.push("appointment_time must be in HH:MM (24-hour) format");
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  if (reason !== undefined && (typeof reason !== "string" || reason.trim().length === 0)) {
    errors.push("reason must be a non-empty string");
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
