import { Request, Response, NextFunction } from "express";

export const validatePatient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, age, address, phoneNumber, clinicianId } = req.body;

  if (!name || !age || !address || !phoneNumber || !clinicianId) {
    return res.status(400).json({
      message: "All patient fields are required"
    });
  }

  next();
};