import { Router } from "express";
import {
  createClinician,
  getClinician,
  updateAvailability
} from "../controllers/clinician.controller";


import { validateClinician } from "../validators/clinician.validator";

const router = Router();


/**
 * @swagger
 * /clinicians:
 *   post:
 *     summary: Register a new clinician
 *     tags: [Clinicians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                   title:
 *                     type: string
 *                     example: Dr.
 *               credentials:
 *                 type: object
 *                 properties:
 *                   licenseNumber:
 *                     type: string
 *                     example: LIC12345
 *                   specialty:
 *                     type: string
 *                     example: Cardiology
 *               contact:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: john@example.com
 *                   phone:
 *                     type: string
 *                     example: 9876543210
 *                   officeAddress:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                         example: 123 Health Street
 *                       city:
 *                         type: string
 *                         example: New York
 *                       state:
 *                         type: string
 *                         example: NY
 *                       postalCode:
 *                         type: string
 *                         example: 10001
 *                       country:
 *                         type: string
 *                         example: USA
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
 *                       example: Main Clinic
 *     responses:
 *       201:
 *         description: Clinician created successfully
 */
router.post("/",validateClinician,createClinician);


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