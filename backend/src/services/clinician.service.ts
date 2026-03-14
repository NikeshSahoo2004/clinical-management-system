import { Clinician } from "../models/clinician.model";

export const createClinician = async (data: any) => {
  // Auto-generate fullName if not provided
  if (!data.fullName && data.name) {
    const { firstName = '', lastName = '', title = '' } = data.name;
    data.fullName = `${title ? title + ' ' : ''}${firstName} ${lastName}`.trim();
  }
  // Auto-set email from contact.email if not provided
  if (!data.email && data.contact && data.contact.email) {
    data.email = data.contact.email;
  }
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