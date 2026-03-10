import * as AppointmentModel from "../models/appointmentModel";
import {
  Appointment,
  AppointmentQuery,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  PaginatedResponse,
} from "../types/appointmentTypes";
import { parsePagination, buildPaginatedResponse } from "../utils/paginationUtils";

export async function getAllAppointments(
  query: AppointmentQuery
): Promise<PaginatedResponse<Appointment>> {
  const { page, limit, offset } = parsePagination(query.page, query.limit);

  const filters = {
    status: query.status,
    doctor_name: query.doctor_name,
    patient_name: query.patient_name,
    date: query.date,
  };

  const { rows, total } = await AppointmentModel.findAll(limit, offset, filters);
  return buildPaginatedResponse(rows, total, page, limit);
}

export async function getAppointmentById(id: number): Promise<Appointment | null> {
  return AppointmentModel.findById(id);
}

export async function createAppointment(data: CreateAppointmentDTO): Promise<Appointment> {
  return AppointmentModel.create(data);
}

export async function updateAppointment(
  id: number,
  data: UpdateAppointmentDTO
): Promise<Appointment | null> {
  const existing = await AppointmentModel.findById(id);
  if (!existing) return null;

  return AppointmentModel.update(id, data);
}

export async function deleteAppointment(id: number): Promise<boolean> {
  return AppointmentModel.remove(id);
}
