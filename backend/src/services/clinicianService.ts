import ClinicianModel from "../models/clinicianModel";

export async function getAllClinicians() {
  const clinicians = await ClinicianModel.find({}).lean();

  return clinicians.map((c: any) => ({
    id: c._id.toString(),
    name: c.name,
    specialization: c.specialization ?? c.credentials?.specialty ?? null,
    department: c.department ?? null,
    contactInfo: c.contactInfo ?? c.contact?.email ?? null,
  }));
}

export async function getClinicianById(id: string) {
  try {
    const c: any = await ClinicianModel.findById(id).lean();
    if (!c) return null;

    return {
      id: c._id.toString(),
      name: c.name,
      specialization: c.specialization ?? c.credentials?.specialty ?? null,
      department: c.department ?? null,
      contactInfo: c.contactInfo ?? c.contact?.email ?? null,
    };
  } catch (error) {
    if ((error as any).name === "CastError") return null;
    throw error;
  }
}
