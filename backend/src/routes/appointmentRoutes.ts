import { Router } from "express";
import * as appointmentController from "../controllers/appointmentController";
import {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateIdParam,
} from "../validators/appointmentValidator";

const router = Router();

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Records per page (default 10, max 100)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled, no-show]
 *         description: Filter by status
 *       - in: query
 *         name: doctor_name
 *         schema:
 *           type: string
 *         description: Filter by doctor name (partial match)
 *       - in: query
 *         name: patient_name
 *         schema:
 *           type: string
 *         description: Filter by patient name (partial match)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Paginated list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAppointments'
 */
router.get("/", appointmentController.getAll);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Appointment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", validateIdParam, appointmentController.getById);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentDTO'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/", validateCreateAppointment, appointmentController.create);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointmentDTO'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.put("/:id", validateIdParam, validateUpdateAppointment, appointmentController.update);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID (MongoDB ObjectId)
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", validateIdParam, appointmentController.remove);

export default router;
