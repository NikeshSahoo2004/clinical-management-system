import { Request, Response } from "express";
import * as clinicianService from "../services/clinicianService";

export async function getAll(_req: Request, res: Response): Promise<void> {
  try {
    const clinicians = await clinicianService.getAllClinicians();
    res.json(clinicians);
  } catch (error) {
    console.error("Error fetching clinicians:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const clinician = await clinicianService.getClinicianById(id);

    if (!clinician) {
      res.status(404).json({ error: "Clinician not found" });
      return;
    }

    res.json(clinician);
  } catch (error) {
    console.error("Error fetching clinician:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
