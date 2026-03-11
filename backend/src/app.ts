import express from "express";
import clinicianRoutes from "./routes/clinician.routes";

const app = express();

app.use(express.json());

app.use("/clinicians", clinicianRoutes);

export default app;