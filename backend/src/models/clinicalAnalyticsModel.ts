import mongoose, { Document, Schema } from "mongoose";
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
  BILLING_STATUSES,
  LOCATION_OPTIONS,
} from "../types/appointmentTypes";
import {
  ClinicalAnalyticsBreakdowns,
  ClinicalAnalyticsQuery,
  ClinicalAnalyticsSnapshot,
  ClinicalAnalyticsSummary,
} from "../types/analyticsTypes";

interface AnalyticsBreakdownItemDocument {
  label: string;
  count: number;
}

interface ClinicalAnalyticsDocument extends Document {
  _id: mongoose.Types.ObjectId;
  signature: string;
  filters: ClinicalAnalyticsQuery;
  appointmentIds: mongoose.Types.ObjectId[];
  summary: ClinicalAnalyticsSummary;
  breakdowns: ClinicalAnalyticsBreakdowns;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SaveClinicalAnalyticsSnapshotInput {
  signature: string;
  filters: ClinicalAnalyticsQuery;
  appointmentIds: string[];
  summary: ClinicalAnalyticsSummary;
  breakdowns: ClinicalAnalyticsBreakdowns;
  generatedAt: Date;
}

const breakdownItemSchema = new Schema<AnalyticsBreakdownItemDocument>(
  {
    label: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const clinicalAnalyticsSchema = new Schema<ClinicalAnalyticsDocument>(
  {
    signature: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    filters: {
      startDate: { type: Date },
      endDate: { type: Date },
      status: { type: String, enum: [...APPOINTMENT_STATUSES] },
      clinicianId: { type: Schema.Types.ObjectId, ref: "Clinician" },
      patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
      appointmentType: { type: String, enum: [...APPOINTMENT_TYPES] },
      location: { type: String, enum: [...LOCATION_OPTIONS] },
      billingStatus: { type: String, enum: [...BILLING_STATUSES] },
    },
    appointmentIds: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    summary: {
      totalAppointments: { type: Number, required: true, min: 0 },
      totalDurationMinutes: { type: Number, required: true, min: 0 },
      averageDurationMinutes: { type: Number, required: true, min: 0 },
      totalBillingAmount: { type: Number, required: true, min: 0 },
      averageBillingAmount: { type: Number, required: true, min: 0 },
      scheduledAppointments: { type: Number, required: true, min: 0 },
      completedAppointments: { type: Number, required: true, min: 0 },
      cancelledAppointments: { type: Number, required: true, min: 0 },
      paidAppointments: { type: Number, required: true, min: 0 },
      pendingAppointments: { type: Number, required: true, min: 0 },
      insuredAppointments: { type: Number, required: true, min: 0 },
    },
    breakdowns: {
      byStatus: { type: [breakdownItemSchema], default: [] },
      byAppointmentType: { type: [breakdownItemSchema], default: [] },
      byLocation: { type: [breakdownItemSchema], default: [] },
      byBillingStatus: { type: [breakdownItemSchema], default: [] },
    },
    generatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        ret.filters = {
          startDate: ret.filters?.startDate ?? undefined,
          endDate: ret.filters?.endDate ?? undefined,
          status: ret.filters?.status ?? undefined,
          clinicianId: ret.filters?.clinicianId?.toString?.() ?? ret.filters?.clinicianId,
          patientId: ret.filters?.patientId?.toString?.() ?? ret.filters?.patientId,
          appointmentType: ret.filters?.appointmentType ?? undefined,
          location: ret.filters?.location ?? undefined,
          billingStatus: ret.filters?.billingStatus ?? undefined,
        };
        ret.appointmentIds = Array.isArray(ret.appointmentIds)
          ? ret.appointmentIds.map((id: mongoose.Types.ObjectId | string) => id.toString())
          : [];
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const ClinicalAnalyticsModel = mongoose.model<ClinicalAnalyticsDocument>(
  "ClinicalAnalytics",
  clinicalAnalyticsSchema
);

function toClinicalAnalyticsSnapshot(
  doc: ClinicalAnalyticsDocument
): ClinicalAnalyticsSnapshot {
  const obj = doc.toJSON();

  return {
    id: obj.id,
    signature: obj.signature,
    filters: obj.filters,
    appointmentIds: obj.appointmentIds,
    summary: obj.summary,
    breakdowns: obj.breakdowns,
    generatedAt: obj.generatedAt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export async function saveSnapshot(
  data: SaveClinicalAnalyticsSnapshotInput
): Promise<ClinicalAnalyticsSnapshot> {
  const doc = await ClinicalAnalyticsModel.findOneAndUpdate(
    { signature: data.signature },
    {
      $set: {
        filters: {
          startDate: data.filters.startDate ? new Date(data.filters.startDate) : undefined,
          endDate: data.filters.endDate ? new Date(data.filters.endDate) : undefined,
          status: data.filters.status,
          clinicianId: data.filters.clinicianId,
          patientId: data.filters.patientId,
          appointmentType: data.filters.appointmentType,
          location: data.filters.location,
          billingStatus: data.filters.billingStatus,
        },
        appointmentIds: data.appointmentIds.map((id) => new mongoose.Types.ObjectId(id)),
        summary: data.summary,
        breakdowns: data.breakdowns,
        generatedAt: data.generatedAt,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).exec();

  return toClinicalAnalyticsSnapshot(doc);
}

export default ClinicalAnalyticsModel;
