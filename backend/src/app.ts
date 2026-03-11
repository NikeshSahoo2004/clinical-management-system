import express from "express";
import clinicianRoutes from "./routes/clinician.routes";
import treatmentRoutes from "./routes/treatment.routes";

const app = express();

app.use(express.json());

app.use("/clinicians", clinicianRoutes);
app.use("/treatment-plans", treatmentRoutes);

export default app;