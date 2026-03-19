import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateTreatmentPlan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { patientId, clinicianId, diagnosis } = req.body;
  const errors: string[] = [];

  // Mongoose Object Id Validations
  if (!patientId) {
    errors.push("Patient ID is required");
  } else if (!mongoose.Types.ObjectId.isValid(patientId)) {
    errors.push("Invalid Patient ID: Must be a valid MongoDB ObjectId");
  }

  if (!clinicianId) {
    errors.push("Clinician ID is required");
  } else if (!mongoose.Types.ObjectId.isValid(clinicianId)) {
    errors.push("Invalid Clinician ID: Must be a valid MongoDB ObjectId");
  }

  // Required Field Validation
  if (!diagnosis) {
    errors.push("Diagnosis is required");
  } else if (typeof diagnosis === "string") {
    if (diagnosis.trim() === "") errors.push("Diagnosis is required");
  } else if (typeof diagnosis === "object") {
    // Your model stores diagnosis as an object: { condition, diagnosedAt, icd10Code }
    const condition = (diagnosis as any).condition;
    if (typeof condition !== "string" || condition.trim() === "") {
      errors.push("Diagnosis condition is required");
    }
  } else {
    errors.push("Diagnosis must be a string or an object");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
