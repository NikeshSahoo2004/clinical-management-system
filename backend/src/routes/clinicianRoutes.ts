import { Router } from "express";
import mongoose from "mongoose";
import * as clinicianController from "../controllers/clinicianController";
import { Request, Response, NextFunction } from "express";

const router = Router();

function validateClinicianId(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id as string;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid clinician ID. Must be a valid MongoDB ObjectId." });
    return;
  }
  next();
}

/**
 * @swagger
 * /api/clinicians:
 *   get:
 *     summary: Get all available clinicians
 *     tags: [Clinicians]
 *     description: Returns a list of all clinicians from the clinicians collection. Use the `id` field as the `clinicianId` when creating an appointment.
 *     responses:
 *       200:
 *         description: List of clinicians
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clinician'
 */
router.get("/", clinicianController.getAll);

/**
 * @swagger
 * /api/clinicians/{id}:
 *   get:
 *     summary: Get a single clinician by ID
 *     tags: [Clinicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clinician ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Clinician found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinician'
 *       404:
 *         description: Clinician not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", validateClinicianId, clinicianController.getById);

export default router;
