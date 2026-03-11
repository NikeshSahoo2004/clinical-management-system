import { Router } from "express";
import {
  createTreatmentPlan,
  getTreatmentPlansByPatient,
  updateTreatmentPlan
} from "../controllers/treatment.controller";

const router = Router();

/**
 * @swagger
 * /treatment-plans:
 *   post:
 *     summary: Create a new treatment plan for a patient
 *     tags: [TreatmentPlans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: 67d12a1f8c9a4e2b1f000001
 *               clinicianId:
 *                 type: string
 *                 example: 67d12a1f8c9a4e2b1f000101
 *               diagnosis:
 *                 type: object
 *                 properties:
 *                   condition:
 *                     type: string
 *                     example: Hypertension
 *                   diagnosedAt:
 *                     type: string
 *                     format: date
 *                     example: 2026-03-10
 *                   icd10Code:
 *                     type: string
 *                     example: I10
 *               prescriptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medication:
 *                       type: string
 *                       example: Amlodipine
 *                     dosage:
 *                       type: string
 *                       example: 5mg
 *                     frequency:
 *                       type: string
 *                       example: Once Daily
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     instructions:
 *                       type: string
 *                       example: Take after breakfast
 *               followUps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     scheduledDate:
 *                       type: string
 *                       format: date
 *                     purpose:
 *                       type: string
 *                       example: Monitor Medication
 *                     status:
 *                       type: string
 *                       example: Pending
 *               recommendations:
 *                 type: object
 *                 properties:
 *                   lifestyleChanges:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: Reduce salt intake
 *                   referrals:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         specialist:
 *                           type: string
 *                           example: Cardiologist
 *                         reason:
 *                           type: string
 *                           example: Further evaluation
 *     responses:
 *       201:
 *         description: Treatment plan created successfully
 */
router.post("/", createTreatmentPlan);


/**
 * @swagger
 * /treatment-plans/patient/{id}:
 *   get:
 *     summary: Fetch all treatment plans for a patient
 *     tags: [TreatmentPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of treatment plans for the patient
 */
router.get("/patient/:id", getTreatmentPlansByPatient);


/**
 * @swagger
 * /treatment-plans/{id}:
 *   put:
 *     summary: Update an existing treatment plan
 *     tags: [TreatmentPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Treatment Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               prescriptions:
 *                 - medication: Ibuprofen
 *                   dosage: 400mg
 *                   frequency: Twice daily
 *                   startDate: 2026-03-11
 *                   endDate: null
 *                   instructions: Take after meals
 *     responses:
 *       200:
 *         description: Treatment plan updated successfully
 */
router.put("/:id", updateTreatmentPlan);

export default router;