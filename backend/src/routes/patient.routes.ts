import { Router } from "express";
import {
  createPatient,
  getPatient,
  getPatients,
  updatePatient,
  deletePatient
} from "../controllers/patient.controller";

import { validatePatient } from "../validators/patient.validator";

const router = Router();

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Johnson
 *               age:
 *                 type: number
 *                 example: 30
 *               address:
 *                 type: string
 *                 example: 123 Park Street, New York
 *               phoneNumber:
 *                 type: string
 *                 example: 9876543210
 *               clinicianId:
 *                 type: string
 *                 example: 67d12a1f8c9a4e2b1f000101
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.post("/", validatePatient, createPatient);


/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Fetch all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get("/", getPatients);


/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Fetch patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient details fetched successfully
 *       404:
 *         description: Patient not found
 */
router.get("/:id", getPatient);


/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update patient details
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Alice Johnson
 *               age: 31
 *               address: New York
 *               phoneNumber: 9876543210
 *     responses:
 *       200:
 *         description: Patient updated successfully
 */
router.put("/:id", updatePatient);


export default router;