import { Request, Response, NextFunction } from "express";

export const validateClinician = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, credentials, contact } = req.body;
  const errors: string[] = [];

  // Validate name fields (nested under `name`)
  const firstName = name?.firstName?.trim();
  const lastName = name?.lastName?.trim();

  if (!firstName || !lastName) {
    errors.push("name.firstName and name.lastName are required");
  }

  // Validate credentials (nested under `credentials`)
  const licenseNumber = credentials?.licenseNumber?.trim();
  const specialty = credentials?.specialty?.trim();

  if (!licenseNumber) {
    errors.push("credentials.licenseNumber is required");
  }

  if (!specialty) {
    errors.push("credentials.specialty is required");
  }

  // Validate contact email (nested under `contact`)
  const email = contact?.email?.trim();

  if (!email) {
    errors.push("contact.email is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
