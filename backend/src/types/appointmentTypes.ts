export interface Appointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  reason: string;
  created_at: Date;
  updated_at: Date;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no-show";

export interface CreateAppointmentDTO {
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status?: AppointmentStatus;
  reason: string;
}

export interface UpdateAppointmentDTO {
  patient_name?: string;
  doctor_name?: string;
  appointment_date?: string;
  appointment_time?: string;
  status?: AppointmentStatus;
  reason?: string;
}

export interface AppointmentQuery {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  doctor_name?: string;
  patient_name?: string;
  date?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
