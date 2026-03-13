import {
  ClinicalAnalyticsBreakdowns,
  ClinicalAnalyticsQuery,
  ClinicalAnalyticsResponse,
  ClinicalAnalyticsSummary,
} from "../types/analyticsTypes";
import { Appointment } from "../types/appointmentTypes";
import { findForAnalytics } from "../models/appointmentModel";
import { saveSnapshot } from "../models/clinicalAnalyticsModel";

function buildSignature(filters: ClinicalAnalyticsQuery): string {
  return JSON.stringify(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== "")
      .sort(([left], [right]) => left.localeCompare(right))
  );
}

function buildBreakdown(
  values: string[],
  preferredOrder: readonly string[] = []
): { label: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const orderedLabels = [
    ...preferredOrder.filter((label) => counts.has(label)),
    ...Array.from(counts.keys())
      .filter((label) => !preferredOrder.includes(label))
      .sort((left, right) => left.localeCompare(right)),
  ];

  return orderedLabels.map((label) => ({
    label,
    count: counts.get(label) ?? 0,
  }));
}

function buildSummary(appointments: Appointment[]): ClinicalAnalyticsSummary {
  const totalAppointments = appointments.length;
  const totalDurationMinutes = appointments.reduce(
    (sum, appointment) => sum + appointment.duration,
    0
  );
  const totalBillingAmount = appointments.reduce(
    (sum, appointment) => sum + (appointment.billing?.amount ?? 0),
    0
  );

  return {
    totalAppointments,
    totalDurationMinutes,
    averageDurationMinutes:
      totalAppointments > 0 ? Number((totalDurationMinutes / totalAppointments).toFixed(2)) : 0,
    totalBillingAmount: Number(totalBillingAmount.toFixed(2)),
    averageBillingAmount:
      totalAppointments > 0 ? Number((totalBillingAmount / totalAppointments).toFixed(2)) : 0,
    scheduledAppointments: appointments.filter((appointment) => appointment.status === "Scheduled").length,
    completedAppointments: appointments.filter((appointment) => appointment.status === "Completed").length,
    cancelledAppointments: appointments.filter((appointment) => appointment.status === "Cancelled").length,
    paidAppointments: appointments.filter((appointment) => appointment.billing.status === "Paid").length,
    pendingAppointments: appointments.filter((appointment) => appointment.billing.status === "Pending").length,
    insuredAppointments: appointments.filter((appointment) => appointment.billing.status === "Insured").length,
  };
}

function buildBreakdowns(appointments: Appointment[]): ClinicalAnalyticsBreakdowns {
  return {
    byStatus: buildBreakdown(appointments.map((appointment) => appointment.status), [
      "Scheduled",
      "Completed",
      "Cancelled",
    ]),
    byAppointmentType: buildBreakdown(
      appointments.map((appointment) => appointment.appointmentType),
      ["Consultation", "Follow-up", "Procedure"]
    ),
    byLocation: buildBreakdown(appointments.map((appointment) => appointment.location), [
      "Main Clinic",
      "Telehealth",
      "Branch Clinic",
    ]),
    byBillingStatus: buildBreakdown(
      appointments.map((appointment) => appointment.billing.status),
      ["Pending", "Paid", "Insured"]
    ),
  };
}

export async function getClinicalAnalytics(
  query: ClinicalAnalyticsQuery
): Promise<ClinicalAnalyticsResponse> {
  const appointments = await findForAnalytics({
    from: query.startDate,
    to: query.endDate,
    status: query.status,
    clinicianId: query.clinicianId,
    patientId: query.patientId,
    appointmentType: query.appointmentType,
    location: query.location,
    billingStatus: query.billingStatus,
  });

  const summary = buildSummary(appointments);
  const breakdowns = buildBreakdowns(appointments);
  const snapshot = await saveSnapshot({
    signature: buildSignature(query),
    filters: query,
    appointmentIds: appointments.map((appointment) => appointment.id),
    summary,
    breakdowns,
    generatedAt: new Date(),
  });

  return {
    filters: query,
    summary,
    breakdowns,
    appointments,
    snapshot,
  };
}

// Wrap a CSV cell value — escapes quotes and wraps in double-quotes if the
// value contains a comma, newline, or double-quote.
function csvCell(value: string | number | null | undefined): string {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(cells: (string | number | null | undefined)[]): string {
  return cells.map(csvCell).join(",");
}

export async function exportAnalyticsAsCsv(
  query: ClinicalAnalyticsQuery
): Promise<string> {
  const appointments = await findForAnalytics({
    from: query.startDate,
    to: query.endDate,
    status: query.status,
    clinicianId: query.clinicianId,
    patientId: query.patientId,
    appointmentType: query.appointmentType,
    location: query.location,
    billingStatus: query.billingStatus,
  });

  const summary = buildSummary(appointments);
  const lines: string[] = [];

  // --- Summary section ---
  lines.push("SUMMARY");
  lines.push(csvRow(["Metric", "Value"]));
  lines.push(csvRow(["Total Appointments", summary.totalAppointments]));
  lines.push(csvRow(["Scheduled", summary.scheduledAppointments]));
  lines.push(csvRow(["Completed", summary.completedAppointments]));
  lines.push(csvRow(["Cancelled", summary.cancelledAppointments]));
  lines.push(csvRow(["Total Duration (mins)", summary.totalDurationMinutes]));
  lines.push(csvRow(["Avg Duration (mins)", summary.averageDurationMinutes]));
  lines.push(csvRow(["Total Billing Amount", summary.totalBillingAmount]));
  lines.push(csvRow(["Avg Billing Amount", summary.averageBillingAmount]));
  lines.push(csvRow(["Paid", summary.paidAppointments]));
  lines.push(csvRow(["Pending", summary.pendingAppointments]));
  lines.push(csvRow(["Insured", summary.insuredAppointments]));

  // blank line between sections
  lines.push("");

  // --- Applied filters ---
  lines.push("FILTERS");
  lines.push(csvRow(["Field", "Value"]));
  if (query.startDate) lines.push(csvRow(["startDate", query.startDate]));
  if (query.endDate) lines.push(csvRow(["endDate", query.endDate]));
  if (query.status) lines.push(csvRow(["status", query.status]));
  if (query.appointmentType) lines.push(csvRow(["appointmentType", query.appointmentType]));
  if (query.location) lines.push(csvRow(["location", query.location]));
  if (query.billingStatus) lines.push(csvRow(["billingStatus", query.billingStatus]));
  if (query.clinicianId) lines.push(csvRow(["clinicianId", query.clinicianId]));
  if (query.patientId) lines.push(csvRow(["patientId", query.patientId]));

  lines.push("");

  // --- Appointments ---
  lines.push("APPOINTMENTS");
  lines.push(
    csvRow([
      "id",
      "patientId",
      "clinicianId",
      "appointmentType",
      "status",
      "scheduledAt",
      "duration (mins)",
      "location",
      "notes",
      "billing.amount",
      "billing.status",
      "billing.insuranceDetails.provider",
      "billing.insuranceDetails.policyNumber",
      "createdAt",
      "updatedAt",
    ])
  );

  for (const appt of appointments) {
    lines.push(
      csvRow([
        appt.id,
        appt.patientId,
        appt.clinicianId,
        appt.appointmentType,
        appt.status,
        appt.scheduledAt instanceof Date
          ? appt.scheduledAt.toISOString()
          : String(appt.scheduledAt),
        appt.duration,
        appt.location,
        appt.notes,
        appt.billing?.amount ?? 0,
        appt.billing?.status ?? "",
        appt.billing?.insuranceDetails?.provider ?? "",
        appt.billing?.insuranceDetails?.policyNumber ?? "",
        appt.createdAt instanceof Date
          ? appt.createdAt.toISOString()
          : String(appt.createdAt),
        appt.updatedAt instanceof Date
          ? appt.updatedAt.toISOString()
          : String(appt.updatedAt),
      ])
    );
  }

  return lines.join("\n");
}
