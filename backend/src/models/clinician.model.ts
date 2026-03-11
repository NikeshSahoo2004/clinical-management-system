import { pool } from "../db/db";

export const createClinician = async (data: any) => {

  const result = await pool.query(
    `INSERT INTO clinicians
     (first_name,last_name,title,license_number,specialty,email,phone)
     VALUES($1,$2,$3,$4,$5,$6,$7)
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

export const updateAvailability = async (id: string, availability: any) => {

  const result = await pool.query(
    `UPDATE clinicians
     SET availability=$1
     WHERE id=$2
     RETURNING *`,
    [JSON.stringify(availability), id]
  );

  return result.rows[0];
};