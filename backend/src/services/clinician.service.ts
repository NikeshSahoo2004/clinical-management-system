import * as clinicianModel from "../models/clinician.model";
import { ClinicianInput } from "../types/clinician.types";
import { pool } from "../db/db";

export const createClinician = async (data: ClinicianInput) => {
  return clinicianModel.createClinician(data);
};

export const getClinicianById = async (id: string) => {

  const result = await pool.query(
    `SELECT * FROM clinicians WHERE id=$1`,
    [id]
  );

  return result.rows[0];
};

export const updateAvailability = async (id: string, availability: any) => {

  const updated = await clinicianModel.updateAvailability(id, availability);

  return updated;
};