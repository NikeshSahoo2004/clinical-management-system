import { Router } from "express";
import {
  loginClinician,
  signupClinician,
  refreshAccessToken,
  logoutClinician
} from "../controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /auth/clinician/signup:
 *   post:
 *     summary: Register a new clinician account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Dr. John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *     responses:
 *       201:
 *         description: Clinician registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinician registered successfully
 *                 accessToken:
 *                   type: string
 *                   description: Access token (short-lived)
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token (long-lived)
 *                 clinician:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *       400:
 *         description: Validation error (missing fields, invalid email, weak password, or mismatch)
 *       409:
 *         description: Clinician with this email already exists
 *       500:
 *         description: Internal server error
 */
router.post("/clinician/signup", signupClinician);

/**
 * @swagger
 * /auth/clinician/login:
 *   post:
 *     summary: Login a clinician
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 clinician:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/clinician/login", loginClinician);

/**
 * @swagger
 * /auth/clinician/refresh:
 *   post:
 *     summary: Generate a new Access Token using Refresh Token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR..."
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Missing refresh token
 *       401:
 *         description: Refresh token expired or invalid
 *       500:
 *         description: Internal server error
 */
router.post("/clinician/refresh", refreshAccessToken);

/**
 * @swagger
 * /auth/clinician/logout:
 *   post:
 *     summary: Logout clinician and clear refresh token cookie
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/clinician/logout", logoutClinician);

export default router;

