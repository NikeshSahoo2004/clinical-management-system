export interface TreatmentPlanInput {
  patientId: number;
  clinicianId: number;
  diagnosis: string;
  medication: string;
  dosage: string;
  frequency: string;
}