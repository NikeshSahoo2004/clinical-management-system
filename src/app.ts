import express from "express";
import clinicianRoutes from "./routes/clinicianRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

const app = express();

app.use(express.json());

app.use("/clinicians", clinicianRoutes);
app.use("/appointments", appointmentRoutes);

export default app;