import * as treatmentModel from "../models/treatment.model";
import { TreatmentPlanInput } from "../types/treatment.types";

export const createTreatmentPlan = async (data: TreatmentPlanInput) => {

  const plan = await treatmentModel.createTreatmentPlan(data);

  return {
    id: plan.id,
    patientId: plan.patient_id,
    clinicianId: plan.clinician_id,
    diagnosis: plan.diagnosis,
    medication: plan.medication,
    dosage: plan.dosage,
    frequency: plan.frequency,
    createdAt: plan.created_at
  };
};

export const getTreatmentPlansByPatient = async (patientId: string) => {

  const plans = await treatmentModel.getTreatmentPlansByPatient(patientId);

  return plans.map((p: any) => ({
    id: p.id,
    patientId: p.patient_id,
    clinicianId: p.clinician_id,
    diagnosis: p.diagnosis,
    medication: p.medication,
    dosage: p.dosage,
    frequency: p.frequency
  }));
};

export const updateTreatmentPlan = async (id: string, data: any) => {

  const updated = await treatmentModel.updateTreatmentPlan(id, data);

  return updated;
};