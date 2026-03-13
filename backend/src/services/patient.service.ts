import { Patient } from "../models/patient.model";
import { PatientInput } from "../types/patient.types";
import { Clinician } from "../models/clinician.model";

export const createPatient = async (data: PatientInput) => {

  const clinician = await Clinician.findById(data.clinicianId);

  if (!clinician) {
    throw new Error("Clinician ID is not present in the database");
  }

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

  if (data.clinicianId) {

    const clinician = await Clinician.findById(data.clinicianId);

    if (!clinician) {
      throw new Error("Clinician ID is not present in the database");
    }
  }

  return await Patient.findByIdAndUpdate(id, data, { new: true });
};

export const deletePatient = async (id: string) => {
  return await Patient.findByIdAndDelete(id);
};