import { Router } from "express";
import {
  createClinician,
  getClinician,
  updateAvailability
} from "../controllers/clinician.controller";

const router = Router();

router.post("/", createClinician);
router.get("/:id", getClinician);
router.put("/:id/availability", updateAvailability);

export default router;