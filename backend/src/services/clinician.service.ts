import { pool } from "../db/db";
import { ClinicianInput } from "../types/clinician.types";

export const createClinician = async (data: ClinicianInput) => {

  const result = await pool.query(
    `INSERT INTO clinicians
    (first_name, last_name, title, license_number, specialty, email, phone)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      data.firstName,
      data.lastName,
      data.title,
      data.licenseNumber,
      data.specialty,
      data.email,
      data.phone
    ]
  );

  return result.rows[0];
};

export const getClinicianById = async (id: string) => {

  const result = await pool.query(
    `SELECT * FROM clinicians WHERE id=$1`,
    [id]
  );

  return result.rows[0];
};