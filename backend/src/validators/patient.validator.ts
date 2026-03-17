import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validatePatient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, age, address, phoneNumber, clinicianId } = req.body;
  const errors: string[] = [];

  if (!name || name.trim() === "") errors.push("Patient name is required");
  if (!age || typeof age !== 'number') errors.push("Patient age is required and must be a number");
  if (!address || address.trim() === "") errors.push("Address is required");
  if (!phoneNumber || phoneNumber.trim() === "") errors.push("Phone number is required");
  
  // Mongodb Validation check for Clinician ID
  if (!clinicianId) {
    errors.push("clinicianId is required");
  } else if (!mongoose.Types.ObjectId.isValid(clinicianId)) {
    errors.push("Invalid clinicianId: Must be a valid MongoDB ObjectId");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
