import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";
import { validateAnalyticsQuery, validateAnalyticsExportBody } from "../validators/analyticsValidator";

const router = Router();

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Fetch clinical analytics from appointments
 *     tags: [Analytics]
 *     description: Returns aggregated clinical analytics for appointments within the requested filters, along with the full matching appointment details.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: >
 *           Inclusive lower-bound for appointment `scheduledAt`.
 *           Accepts `YYYY-MM-DD` (auto-expanded to `T00:00:00.000Z`)
 *           or a full ISO-8601 datetime (e.g. `2026-03-01T00:00:00.000Z`).
 *         examples:
 *           dateOnly:
 *             summary: Date only
 *             value: "2026-03-01"
 *           datetime:
 *             summary: Full ISO-8601
 *             value: "2026-03-01T00:00:00.000Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: >
 *           Inclusive upper-bound for appointment `scheduledAt`.
 *           Accepts `YYYY-MM-DD` (auto-expanded to `T23:59:59.999Z` so the full day is included)
 *           or a full ISO-8601 datetime (e.g. `2026-03-31T23:59:59.999Z`).
 *         examples:
 *           dateOnly:
 *             summary: Date only
 *             value: "2026-03-31"
 *           datetime:
 *             summary: Full ISO-8601
 *             value: "2026-03-31T23:59:59.999Z"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Scheduled, Completed, Cancelled]
 *         description: Filter by appointment status
 *       - in: query
 *         name: clinicianId
 *         schema:
 *           type: string
 *         description: Filter by clinician ObjectId
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *         description: Filter by patient ObjectId
 *       - in: query
 *         name: appointmentType
 *         schema:
 *           type: string
 *           enum: [Consultation, Follow-up, Procedure]
 *         description: Filter by appointment type
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           enum: [Main Clinic, Telehealth, Branch Clinic]
 *         description: Filter by appointment location
 *       - in: query
 *         name: billingStatus
 *         schema:
 *           type: string
 *           enum: [Pending, Paid, Insured]
 *         description: Filter by billing status
 *     responses:
 *       200:
 *         description: Clinical analytics with matching appointment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicalAnalyticsResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.get("/", validateAnalyticsQuery, analyticsController.getClinicalAnalytics);

/**
 * @swagger
 * /api/analytics/export:
 *   post:
 *     summary: Export analytics data as CSV
 *     tags: [Analytics]
 *     description: >
 *       Accepts the same filter set as `GET /api/analytics` (in the request body)
 *       and returns a downloadable CSV file.
 *       The CSV is structured in three sections — **SUMMARY**, **FILTERS**, and
 *       **APPOINTMENTS** — separated by blank lines.
 *       Both `YYYY-MM-DD` and full ISO-8601 datetime strings are accepted for
 *       `startDate` / `endDate`.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyticsExportBody'
 *           examples:
 *             dateRange:
 *               summary: Export all appointments in Q1 2026
 *               value:
 *                 startDate: "2026-01-01"
 *                 endDate: "2026-03-31"
 *             withFilters:
 *               summary: Export completed consultations only
 *               value:
 *                 status: "Completed"
 *                 appointmentType: "Consultation"
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 SUMMARY
 *                 Metric,Value
 *                 Total Appointments,5
 *                 ...
 *       400:
 *         description: Validation error in request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/export", validateAnalyticsExportBody, analyticsController.exportAnalytics);

export default router;
