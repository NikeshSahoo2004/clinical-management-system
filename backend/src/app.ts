import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./swagger";
import appointmentRoutes from "./routes/appointmentRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import clinicianRoutes from "./routes/clinicianRoutes";
import treatmentRoutes from "./routes/treatment.routes";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

/* Routes */
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/clinicians", clinicianRoutes);
app.use("/treatment-plans", treatmentRoutes);

/* Swagger */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Health check */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

/* 404 handler */
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* Global error handler */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;