import { Router } from "express";
import { createClinician, getClinician } from "../controllers/clinician.controller";

const router = Router();

router.post("/", createClinician);
router.get("/:id", getClinician);

export default router;