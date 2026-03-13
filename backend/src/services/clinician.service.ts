import { Clinician } from "../models/clinician.model";

export const createClinician = async (data: any) => {

  const clinician = new Clinician(data);

  return await clinician.save();
};

export const getClinicianById = async (id: string) => {

  return await Clinician.findById(id);

};

export const updateAvailability = async (id: string, availability: any) => {

  return await Clinician.findByIdAndUpdate(
    id,
    { availability },
    { new: true }
  );

};