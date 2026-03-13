import { TreatmentPlan } from "../models/treatment.model";

export const createTreatmentPlan = async (data: any) => {
  const treatment = new TreatmentPlan(data);
  return await treatment.save();
};

export const getTreatmentPlansByPatient = async (patientId: string) => {
  return await TreatmentPlan.find({ patientId });
};

export const updateTreatmentPlan = async (id: string, data: any) => {
  return await TreatmentPlan.findByIdAndUpdate(id, data, { new: true });
};