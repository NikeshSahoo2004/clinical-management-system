import { Request, Response, NextFunction } from "express";

export const validateClinician = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, licenseNumber, specialty } = req.body;
  const errors: string[] = [];

  if (!firstName || !lastName || firstName.trim() === "" || lastName.trim() === "") {
    errors.push("First name and Last name are required");
  }

  if (!licenseNumber || licenseNumber.trim() === "") {
    errors.push("License number is required");
  }

  if (!specialty || specialty.trim() === "") {
    errors.push("Specialty is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
