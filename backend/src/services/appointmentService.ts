import * as AppointmentModel from "../models/appointmentModel";
import {
  Appointment,
  PopulatedAppointment,
  AppointmentQuery,
  AppointmentStatus,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  PaginatedResponse,
  VALID_STATUS_TRANSITIONS,
} from "../types/appointmentTypes";
import { parsePagination, buildPaginatedResponse } from "../utils/paginationUtils";

export async function getAllAppointments(
  query: AppointmentQuery
): Promise<PaginatedResponse<Appointment>> {
  const { page, limit, offset } = parsePagination(query.page, query.limit);

  const filters = {
    status: query.status,
    clinicianId: query.clinicianId,
    patientId: query.patientId,
    appointmentType: query.appointmentType,
    from: query.from,
    to: query.to,
  };

  const { rows, total } = await AppointmentModel.findAll(limit, offset, filters);
  return buildPaginatedResponse(rows, total, page, limit);
}

export async function getAllAppointmentsPopulated(
  query: AppointmentQuery
): Promise<PaginatedResponse<PopulatedAppointment>> {
  const { page, limit, offset } = parsePagination(query.page, query.limit);

  const filters = {
    status: query.status,
    clinicianId: query.clinicianId,
    patientId: query.patientId,
    appointmentType: query.appointmentType,
    from: query.from,
    to: query.to,
  };

  const { rows, total } = await AppointmentModel.findAllPopulated(limit, offset, filters);
  return buildPaginatedResponse(rows, total, page, limit);
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  return AppointmentModel.findById(id);
}

export async function getAppointmentByIdPopulated(
  id: string
): Promise<PopulatedAppointment | null> {
  return AppointmentModel.findByIdPopulated(id);
}

export async function createAppointment(data: CreateAppointmentDTO): Promise<Appointment> {
  // Prevent double-booking: check for overlapping appointments for this clinician
  const overlap = await AppointmentModel.hasOverlap(
    data.clinicianId,
    new Date(data.scheduledAt),
    data.duration
  );
  if (overlap) {
    const err: any = new Error(
      "Clinician already has an overlapping appointment in the requested time slot"
    );
    err.name = "OverlapError";
    throw err;
  }

  return AppointmentModel.create(data);
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentDTO
): Promise<Appointment | null> {
  const existing = await AppointmentModel.findById(id);
  if (!existing) return null;

  // If clinicianId, scheduledAt, or duration changed, re-check for overlaps
  if (data.clinicianId !== undefined || data.scheduledAt !== undefined || data.duration !== undefined) {
    const clinicianId = data.clinicianId ?? existing.clinicianId;
    const scheduledAt = data.scheduledAt
      ? new Date(data.scheduledAt)
      : existing.scheduledAt;
    const duration = data.duration ?? existing.duration;

    const overlap = await AppointmentModel.hasOverlap(
      clinicianId,
      scheduledAt,
      duration,
      id // exclude current appointment
    );
    if (overlap) {
      const err: any = new Error(
        "Clinician already has an overlapping appointment in the requested time slot"
      );
      err.name = "OverlapError";
      throw err;
    }
  }

  return AppointmentModel.update(id, data);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment | null> {
  const existing = await AppointmentModel.findById(id);
  if (!existing) return null;

  const allowed = VALID_STATUS_TRANSITIONS[existing.status];
  if (!allowed.includes(status)) {
    const err: any = new Error(
      `Cannot transition from "${existing.status}" to "${status}". ` +
      `Allowed transitions: ${allowed.length ? allowed.join(", ") : "none (terminal state)"}`
    );
    err.name = "StatusTransitionError";
    throw err;
  }

  return AppointmentModel.updateStatus(id, status);
}

export async function deleteAppointment(id: string): Promise<boolean> {
  return AppointmentModel.remove(id);
}
