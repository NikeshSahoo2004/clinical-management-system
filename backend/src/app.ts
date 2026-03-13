import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { swaggerUi, swaggerSpec } from "./utils/swagger";
import appointmentRoutes from "./routes/appointmentRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import clinicianRoutes from "./routes/clinician.routes";
import treatmentRoutes from "./routes/treatment.routes";
import patientRoutes from "./routes/patient.routes";
import authRoutes from "./routes/auth.routes";


const app = express();

/* Middleware */
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

/* Routes */
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/clinicians", clinicianRoutes);
app.use("/treatment-plans", treatmentRoutes);
app.use("/patients", patientRoutes);
app.use("/auth", authRoutes);

/* Swagger Documentation */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Health Check */
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* 404 Handler */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/* Global Error Handler */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;