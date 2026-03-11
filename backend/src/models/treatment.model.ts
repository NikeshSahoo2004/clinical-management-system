import { pool } from "../db/db";
import { TreatmentPlanInput } from "../types/treatment.types";

export const createTreatmentPlan = async (data: TreatmentPlanInput) => {
  const result = await pool.query(
    `INSERT INTO treatment_plans
     (patient_id, clinician_id, diagnosis, medication, dosage, frequency)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      data.patientId,
      data.clinicianId,
      data.diagnosis,
      data.medication,
      data.dosage,
      data.frequency
    ]
  );

  return result.rows[0];
};

export const getTreatmentPlansByPatient = async (patientId: string) => {
  const result = await pool.query(
    `SELECT * FROM treatment_plans
     WHERE patient_id = $1`,
    [patientId]
  );

  return result.rows;
};

export const updateTreatmentPlan = async (id: string, data: any) => {
  const result = await pool.query(
    `UPDATE treatment_plans
     SET diagnosis=$1,
         medication=$2,
         dosage=$3,
         frequency=$4
     WHERE id=$5
     RETURNING *`,
    [
      data.diagnosis,
      data.medication,
      data.dosage,
      data.frequency,
      id
    ]
  );

  return result.rows[0];
};