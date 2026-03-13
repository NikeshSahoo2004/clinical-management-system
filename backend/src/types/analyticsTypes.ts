import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  BillingStatus,
  LocationOption,
} from "./appointmentTypes";

export interface ClinicalAnalyticsQuery {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  clinicianId?: string;
  patientId?: string;
  appointmentType?: AppointmentType;
  location?: LocationOption;
  billingStatus?: BillingStatus;
}

export interface AnalyticsBreakdownItem {
  label: string;
  count: number;
}

export interface ClinicalAnalyticsSummary {
  totalAppointments: number;
  totalDurationMinutes: number;
  averageDurationMinutes: number;
  totalBillingAmount: number;
  averageBillingAmount: number;
  scheduledAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  paidAppointments: number;
  pendingAppointments: number;
  insuredAppointments: number;
}

export interface ClinicalAnalyticsBreakdowns {
  byStatus: AnalyticsBreakdownItem[];
  byAppointmentType: AnalyticsBreakdownItem[];
  byLocation: AnalyticsBreakdownItem[];
  byBillingStatus: AnalyticsBreakdownItem[];
}

export interface ClinicalAnalyticsSnapshot {
  id: string;
  signature: string;
  filters: ClinicalAnalyticsQuery;
  appointmentIds: string[];
  summary: ClinicalAnalyticsSummary;
  breakdowns: ClinicalAnalyticsBreakdowns;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicalAnalyticsResponse {
  filters: ClinicalAnalyticsQuery;
  summary: ClinicalAnalyticsSummary;
  breakdowns: ClinicalAnalyticsBreakdowns;
  appointments: Appointment[];
  snapshot: ClinicalAnalyticsSnapshot;
}
