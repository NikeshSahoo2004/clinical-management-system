import { Router } from "express";
import {
  createTreatmentPlan,
  getTreatmentPlansByPatient,
  updateTreatmentPlan
} from "../controllers/treatment.controller";

const router = Router();

router.post("/", createTreatmentPlan);
router.get("/patient/:id", getTreatmentPlansByPatient);
router.put("/:id", updateTreatmentPlan);

export default router;