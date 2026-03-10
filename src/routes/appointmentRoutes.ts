import { Router } from "express";
import * as appointmentController from "../controllers/appointmentController";
import {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateIdParam,
} from "../validators/appointmentValidator";

const router = Router();

router.get("/", appointmentController.getAll);
router.get("/:id", validateIdParam, appointmentController.getById);
router.post("/", validateCreateAppointment, appointmentController.create);
router.put("/:id", validateIdParam, validateUpdateAppointment, appointmentController.update);
router.delete("/:id", validateIdParam, appointmentController.remove);

export default router;
