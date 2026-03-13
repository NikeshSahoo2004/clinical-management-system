import express from "express";
import { swaggerUi, swaggerSpec } from "./utils/swagger";

import clinicianRoutes from "./routes/clinician.routes";
import treatmentRoutes from "./routes/treatment.routes";

const app = express();

app.use(express.json());

app.use("/clinicians", clinicianRoutes);
app.use("/treatment-plans", treatmentRoutes);

/* Swagger UI */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;