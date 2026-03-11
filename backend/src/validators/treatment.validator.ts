import { TreatmentPlanInput } from "../types/treatment.types";

export const validateTreatmentPlan = (data: TreatmentPlanInput) => {

  if (!data.patientId) throw new Error("Patient ID required");

  if (!data.clinicianId) throw new Error("Clinician ID required");

  if (!data.diagnosis) throw new Error("Diagnosis required");

  return true;
};