import { Router } from "express";
import {
  createClinician,
  getClinician,
  updateAvailability
} from "../controllers/clinician.controller";

const router = Router();


/**
 * @swagger
 * /clinicians/{id}:
 *   get:
 *     summary: Fetch clinician details including availability
 *     tags: [Clinicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clinician ID
 *     responses:
 *       200:
 *         description: Clinician details fetched successfully
 *       404:
 *         description: Clinician not found
 */
router.get("/:id", getClinician);


/**
 * @swagger
 * /clinicians/{id}/availability:
 *   put:
 *     summary: Update clinician availability schedule
 *     tags: [Clinicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clinician ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: string
 *                       example: Monday
 *                     startTime:
 *                       type: string
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       example: "17:00"
 *                     location:
 *                       type: string
 *                       example: Downtown Branch
 *     responses:
 *       200:
 *         description: Availability updated successfully
 */
router.put("/:id/availability", updateAvailability);

export default router;