import { Patient } from "../models/patient.model";
import { PatientInput } from "../types/patient.types";

export const createPatient = async (data: PatientInput) => {
  const patient = new Patient(data);
  return await patient.save();
};

export const getPatientById = async (id: string) => {
  return await Patient.findById(id).populate("clinicianId");
};

export const getAllPatients = async () => {
  return await Patient.find().populate("clinicianId");
};

export const updatePatient = async (
  id: string,
  data: Partial<PatientInput>
) => {
  return await Patient.findByIdAndUpdate(id, data, {
    new: true
  });
};

export const deletePatient = async (id: string) => {
  return await Patient.findByIdAndDelete(id);
};