import { ClinicianInput } from "../types/clinician.types";

export const validateClinician = (data: ClinicianInput) => {
  if (!data.firstName || !data.lastName) {
    throw new Error("Name is required");
  }

  if (!data.licenseNumber) {
    throw new Error("License number required");
  }

  if (!data.specialty) {
    throw new Error("Specialty required");
  }

  return true;
};