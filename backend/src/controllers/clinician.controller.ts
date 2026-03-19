import { Request, Response } from "express";
import mongoose from "mongoose";
import * as clinicianService from "../services/clinician.service";

export const createClinician = async (req: Request, res: Response) => {
  try {

    const clinician = await clinicianService.createClinician(req.body);

    res.status(201).json(clinician);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error creating clinician"
    });
  }
};


export const getClinician = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    // Validate MongoDB ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid clinician ID format"
      });
    }

    const clinician = await clinicianService.getClinicianById(id);

    if (!clinician) {
      return res.status(404).json({
        message: "Clinician not found"
      });
    }

    res.json(clinician);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching clinician"
    });
  }
};


export const updateAvailability = async (req: Request, res: Response) => {
  try {

    const id = String(req.params.id);

    const availability = req.body.availability;

    const updated = await clinicianService.updateAvailability(id, availability);

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: "Error updating availability"
    });
  }
};