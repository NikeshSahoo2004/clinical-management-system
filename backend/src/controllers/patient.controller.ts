import { Request, Response } from "express";
import * as patientService from "../services/patient.service";

export const createPatient = async (req: Request, res: Response) => {
  try {

    const patient = await patientService.createPatient(req.body);

    res.status(201).json({
      message: "Patient created successfully",
      data: patient
    });

  } catch (error: any) {

    if (error.message === "Clinician ID is not present in the database") {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: "Error creating patient"
    });
  }
};

export const getPatient = async (req: Request, res: Response) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching patient"
    });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await patientService.getAllPatients();

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching patients"
    });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await patientService.updatePatient(
      req.params.id,
      req.body
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating patient"
    });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await patientService.deletePatient(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.status(200).json({
      message: "Patient deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting patient"
    });
  }
};