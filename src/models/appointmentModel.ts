import { pool } from "../db/db";
import {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../types/appointmentTypes";

export async function initializeTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_name VARCHAR(255) NOT NULL,
      doctor_name VARCHAR(255) NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
      reason TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
}

export async function findAll(
  limit: number,
  offset: number,
  filters: { status?: string; doctor_name?: string; patient_name?: string; date?: string }
): Promise<{ rows: Appointment[]; total: number }> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (filters.status) {
    conditions.push(`status = $${paramIndex++}`);
    values.push(filters.status);
  }
  if (filters.doctor_name) {
    conditions.push(`doctor_name ILIKE $${paramIndex++}`);
    values.push(`%${filters.doctor_name}%`);
  }
  if (filters.patient_name) {
    conditions.push(`patient_name ILIKE $${paramIndex++}`);
    values.push(`%${filters.patient_name}%`);
  }
  if (filters.date) {
    conditions.push(`appointment_date = $${paramIndex++}`);
    values.push(filters.date);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countQuery = `SELECT COUNT(*) FROM appointments ${whereClause}`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);

  const dataQuery = `
    SELECT * FROM appointments ${whereClause}
    ORDER BY appointment_date ASC, appointment_time ASC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
  const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

  return { rows: dataResult.rows, total };
}

export async function findById(id: number): Promise<Appointment | null> {
  const result = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function create(data: CreateAppointmentDTO): Promise<Appointment> {
  const result = await pool.query(
    `INSERT INTO appointments (patient_name, doctor_name, appointment_date, appointment_time, status, reason)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.patient_name,
      data.doctor_name,
      data.appointment_date,
      data.appointment_time,
      data.status || "scheduled",
      data.reason,
    ]
  );
  return result.rows[0];
}

export async function update(id: number, data: UpdateAppointmentDTO): Promise<Appointment | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.patient_name !== undefined) {
    fields.push(`patient_name = $${paramIndex++}`);
    values.push(data.patient_name);
  }
  if (data.doctor_name !== undefined) {
    fields.push(`doctor_name = $${paramIndex++}`);
    values.push(data.doctor_name);
  }
  if (data.appointment_date !== undefined) {
    fields.push(`appointment_date = $${paramIndex++}`);
    values.push(data.appointment_date);
  }
  if (data.appointment_time !== undefined) {
    fields.push(`appointment_time = $${paramIndex++}`);
    values.push(data.appointment_time);
  }
  if (data.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(data.status);
  }
  if (data.reason !== undefined) {
    fields.push(`reason = $${paramIndex++}`);
    values.push(data.reason);
  }

  if (fields.length === 0) return findById(id);

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE appointments SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function remove(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
