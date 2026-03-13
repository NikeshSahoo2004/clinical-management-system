import { Request, Response } from "express";
import * as treatmentService from "../services/treatment.service";


export const createTreatmentPlan = async (req: Request, res: Response) => {
  try {

    const plan = await treatmentService.createTreatmentPlan(req.body);

    res.status(201).json(plan);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error creating treatment plan"
    });
  }
};


export const getTreatmentPlansByPatient = async (req: Request, res: Response) => {
  try {

    const patientId = String(req.params.id);

    const plans = await treatmentService.getTreatmentPlansByPatient(patientId);

    res.json(plans);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching treatment plans"
    });
  }
};


export const updateTreatmentPlan = async (req: Request, res: Response) => {
  try {

    const treatmentId = String(req.params.id);

    const updatedPlan = await treatmentService.updateTreatmentPlan(
      treatmentId,
      req.body
    );

    if (!updatedPlan) {
      return res.status(404).json({
        message: "No such treatment plan exists"
      });
    }

    res.status(200).json({
      message: "Treatment plan updated successfully",
      data: updatedPlan
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error updating treatment plan"
    });

  }
};