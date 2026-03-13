import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import * as clinicianController from "../controllers/clinicianController";

const router = Router();

function validateClinicianId(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id as string;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid clinician ID. Must be a valid MongoDB ObjectId." });
    return;
  }
  next();
}

router.get("/", clinicianController.getAll);
router.get("/:id", validateClinicianId, clinicianController.getById);

export default router;
