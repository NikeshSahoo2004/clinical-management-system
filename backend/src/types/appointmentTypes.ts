export const APPOINTMENT_TYPES = ["Consultation", "Follow-up", "Procedure"] as const;
export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export const APPOINTMENT_STATUSES = ["Scheduled", "Completed", "Cancelled"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const BILLING_STATUSES = ["Pending", "Paid", "Insured"] as const;
export type BillingStatus = (typeof BILLING_STATUSES)[number];

export const LOCATION_OPTIONS = ["Main Clinic", "Telehealth", "Branch Clinic"] as const;
export type LocationOption = (typeof LOCATION_OPTIONS)[number];

export const MAX_DURATION = 480; // 8 hours in minutes

export const VALID_STATUS_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  Scheduled: ["Completed", "Cancelled"],
  Completed: [],            // terminal
  Cancelled: ["Scheduled"], // allow re-scheduling
};

export interface InsuranceDetails {
  provider: string | null;
  policyNumber: string | null;
}

export interface Billing {
  amount: number;
  status: BillingStatus;
  insuranceDetails: InsuranceDetails;
}

export interface Appointment {
  id: string;
  patientId: string;
  clinicianId: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  scheduledAt: Date;
  duration: number; // minutes
  location: LocationOption;
  notes: string;
  billing: Billing;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedClinician {
  id: string;
  name: string;
  specialization: string;
  department: string;
  contactInfo: string;
}

export interface PopulatedAppointment extends Omit<Appointment, "clinicianId"> {
  clinicianId: PopulatedClinician;
}

export interface CreateAppointmentDTO {
  patientId: string;
  clinicianId: string;
  appointmentType: AppointmentType;
  status?: AppointmentStatus;
  scheduledAt: string; // ISO-8601
  duration: number;
  location: LocationOption;
  notes?: string;
  billing?: {
    amount?: number;
    status?: BillingStatus;
    insuranceDetails?: {
      provider?: string | null;
      policyNumber?: string | null;
    };
  };
}

export interface UpdateAppointmentDTO {
  patientId?: string;
  clinicianId?: string;
  appointmentType?: AppointmentType;
  status?: AppointmentStatus;
  scheduledAt?: string;
  duration?: number;
  location?: LocationOption;
  notes?: string;
  billing?: {
    amount?: number;
    status?: BillingStatus;
    insuranceDetails?: {
      provider?: string | null;
      policyNumber?: string | null;
    };
  };
}

export interface UpdateStatusDTO {
  status: AppointmentStatus;
}

export interface AppointmentQuery {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  clinicianId?: string;
  patientId?: string;
  appointmentType?: AppointmentType;
  from?: string; // ISO lower-bound for scheduledAt
  to?: string;   // ISO upper-bound for scheduledAt
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
