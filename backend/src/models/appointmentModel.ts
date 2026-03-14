import mongoose, { Schema, Document } from "mongoose";
import "./clinician.model"; // Register Clinician model for .populate()
import {
  Appointment,
  PopulatedAppointment,
  PopulatedClinician,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentStatus,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUSES,
  BILLING_STATUSES,
  LOCATION_OPTIONS,
  MAX_DURATION,
} from "../types/appointmentTypes";


export interface AppointmentDocument
  extends Omit<Appointment, "id" | "patientId" | "clinicianId">,
  Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  clinicianId: mongoose.Types.ObjectId;
}


const insuranceDetailsSchema = new Schema(
  {
    provider: { type: String, default: null },
    policyNumber: { type: String, default: null },
  },
  { _id: false }
);

const billingSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: [...BILLING_STATUSES],
      default: "Pending",
    },
    insuranceDetails: { type: insuranceDetailsSchema, default: () => ({}) },
  },
  { _id: false }
);


const appointmentSchema = new Schema<AppointmentDocument>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    clinicianId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Clinician",
    },
    appointmentType: {
      type: String,
      enum: [...APPOINTMENT_TYPES],
      required: true,
    },
    status: {
      type: String,
      enum: [...APPOINTMENT_STATUSES],
      default: "Scheduled",
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: [5, "Duration must be at least 5 minutes"],
      max: [MAX_DURATION, `Duration must not exceed ${MAX_DURATION} minutes`],
      default: 30,
    },
    location: {
      type: String,
      enum: [...LOCATION_OPTIONS],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    billing: {
      type: billingSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        ret.patientId = ret.patientId?.toString?.() ?? ret.patientId;
        // Only stringify clinicianId if it's an ObjectId, not a populated object
        if (ret.clinicianId && typeof ret.clinicianId !== "object") {
          ret.clinicianId = ret.clinicianId.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        ret.patientId = ret.patientId?.toString?.() ?? ret.patientId;
        if (ret.clinicianId && typeof ret.clinicianId !== "object") {
          ret.clinicianId = ret.clinicianId.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);


appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ clinicianId: 1 });
appointmentSchema.index({ scheduledAt: 1 });
appointmentSchema.index({ clinicianId: 1, scheduledAt: 1 }); // compound index to prevent double booking
appointmentSchema.index({ status: 1 });

// Direct collection lookups so we don't need to import Patient/Clinician models here
async function verifyClinicianExists(
  clinicianId: mongoose.Types.ObjectId | string
): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database not connected");

  const objectId =
    typeof clinicianId === "string"
      ? new mongoose.Types.ObjectId(clinicianId)
      : clinicianId;

  const clinician = await db
    .collection("clinicians")
    .findOne({ _id: objectId }, { projection: { _id: 1 } });

  if (!clinician) {
    const err: any = new Error(
      `Clinician with id "${clinicianId}" does not exist in the clinicians collection`
    );
    err.name = "ReferentialIntegrityError";
    throw err;
  }
}


async function verifyPatientExists(
  patientId: mongoose.Types.ObjectId | string
): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database not connected");

  const objectId =
    typeof patientId === "string"
      ? new mongoose.Types.ObjectId(patientId)
      : patientId;

  const patient = await db
    .collection("patients")
    .findOne({ _id: objectId }, { projection: { _id: 1 } });

  if (!patient) {
    const err: any = new Error(
      `Patient with id "${patientId}" does not exist in the patients collection`
    );
    err.name = "ReferentialIntegrityError";
    throw err;
  }
}

// Enforce referential integrity on create — reject unknown clinician/patient IDs
appointmentSchema.pre("save", async function () {
  await verifyClinicianExists(this.clinicianId);
  await verifyPatientExists(this.patientId);
});

const AppointmentModel = mongoose.model<AppointmentDocument>(
  "Appointment",
  appointmentSchema
);

function toAppointment(doc: AppointmentDocument): Appointment {
  const obj = doc.toJSON();
  return {
    id: obj.id,
    patientId: obj.patientId,
    clinicianId: obj.clinicianId,
    appointmentType: obj.appointmentType,
    status: obj.status as AppointmentStatus,
    scheduledAt: obj.scheduledAt,
    duration: obj.duration,
    location: obj.location,
    notes: obj.notes ?? "",
    billing: {
      amount: obj.billing?.amount ?? 0,
      status: obj.billing?.status ?? "Pending",
      insuranceDetails: {
        provider: obj.billing?.insuranceDetails?.provider ?? null,
        policyNumber: obj.billing?.insuranceDetails?.policyNumber ?? null,
      },
    },
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}


function toPopulatedAppointment(doc: any): PopulatedAppointment {
  const obj = doc.toJSON();
  const clinician = obj.clinicianId;
  return {
    id: obj.id,
    patientId: obj.patientId,
    clinicianId:
      clinician && typeof clinician === "object"
        ? {
          id: clinician.id ?? clinician._id?.toString(),
          name: clinician.name
            ? `${clinician.name.title ?? ""} ${clinician.name.firstName ?? ""} ${clinician.name.lastName ?? ""}`.trim()
            : "",
          specialization: clinician.credentials?.specialty ?? "",
          department: clinician.availability?.[0]?.location ?? "",
          contactInfo: clinician.contact?.email ?? "",
        }
        : (clinician as any), // fallback when not populated
    appointmentType: obj.appointmentType,
    status: obj.status,
    scheduledAt: obj.scheduledAt,
    duration: obj.duration,
    location: obj.location,
    notes: obj.notes ?? "",
    billing: {
      amount: obj.billing?.amount ?? 0,
      status: obj.billing?.status ?? "Pending",
      insuranceDetails: {
        provider: obj.billing?.insuranceDetails?.provider ?? null,
        policyNumber: obj.billing?.insuranceDetails?.policyNumber ?? null,
      },
    },
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

// Returns true if the clinician has a conflicting appointment in the requested window
export async function hasOverlap(
  clinicianId: string,
  scheduledAt: Date,
  duration: number,
  excludeId?: string
): Promise<boolean> {
  const start = scheduledAt;
  const end = new Date(start.getTime() + duration * 60_000);

  const query: Record<string, any> = {
    clinicianId: new mongoose.Types.ObjectId(clinicianId),
    status: { $ne: "Cancelled" },
    $expr: {
      $and: [
        // existing appointment starts before proposed end
        { $lt: [{ $toDate: "$scheduledAt" }, end] },
        // existing appointment ends after proposed start
        {
          $gt: [
            {
              $add: [
                { $toDate: "$scheduledAt" },
                { $multiply: [{ $toInt: "$duration" }, 60_000] },
              ],
            },
            start,
          ],
        },
      ],
    },
  };

  if (excludeId) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
  }

  const conflict = await AppointmentModel.findOne(query)
    .select("_id")
    .lean()
    .exec();

  return conflict !== null;
}


export async function initializeTable(): Promise<void> {
  await AppointmentModel.ensureIndexes();
}

export interface AppointmentFilters {
  status?: string;
  clinicianId?: string;
  patientId?: string;
  appointmentType?: string;
  location?: string;
  billingStatus?: string;
  from?: string;
  to?: string;
}

export function buildAppointmentQuery(
  filters: AppointmentFilters
): Record<string, any> {
  const query: Record<string, any> = {};

  if (filters.status) query.status = filters.status;
  if (filters.clinicianId) query.clinicianId = filters.clinicianId;
  if (filters.patientId) query.patientId = filters.patientId;
  if (filters.appointmentType) query.appointmentType = filters.appointmentType;
  if (filters.location) query.location = filters.location;
  if (filters.billingStatus) query["billing.status"] = filters.billingStatus;

  if (filters.from || filters.to) {
    query.scheduledAt = {};
    if (filters.from) query.scheduledAt.$gte = new Date(filters.from);
    if (filters.to) query.scheduledAt.$lte = new Date(filters.to);
  }

  return query;
}

export async function findAll(
  limit: number,
  offset: number,
  filters: AppointmentFilters
): Promise<{ rows: Appointment[]; total: number }> {
  const query = buildAppointmentQuery(filters);

  const total = await AppointmentModel.countDocuments(query);

  const docs = await AppointmentModel.find(query)
    .sort({ scheduledAt: 1 })
    .skip(offset)
    .limit(limit)
    .exec();

  const rows = docs.map(toAppointment);
  return { rows, total };
}

export async function findById(id: string): Promise<Appointment | null> {
  try {
    const doc = await AppointmentModel.findById(id).exec();
    return doc ? toAppointment(doc) : null;
  } catch (error) {
    if ((error as any).name === "CastError") return null;
    throw error;
  }
}

export async function create(data: CreateAppointmentDTO): Promise<Appointment> {
  const doc = await AppointmentModel.create({
    patientId: data.patientId,
    clinicianId: data.clinicianId,
    appointmentType: data.appointmentType,
    status: data.status || "Scheduled",
    scheduledAt: new Date(data.scheduledAt),
    duration: data.duration,
    location: data.location,
    notes: data.notes ?? "",
    billing: {
      amount: data.billing?.amount ?? 0,
      status: data.billing?.status ?? "Pending",
      insuranceDetails: {
        provider: data.billing?.insuranceDetails?.provider ?? null,
        policyNumber: data.billing?.insuranceDetails?.policyNumber ?? null,
      },
    },
  });

  return toAppointment(doc);
}

export async function update(
  id: string,
  data: UpdateAppointmentDTO
): Promise<Appointment | null> {
  try {
    const updateData: Record<string, any> = {};

    if (data.patientId !== undefined) {
      updateData.patientId = data.patientId;
    }
    if (data.clinicianId !== undefined) {
      await verifyClinicianExists(data.clinicianId);
      updateData.clinicianId = data.clinicianId;
    }
    if (data.appointmentType !== undefined) updateData.appointmentType = data.appointmentType;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.scheduledAt !== undefined) updateData.scheduledAt = new Date(data.scheduledAt);
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.notes !== undefined) updateData.notes = data.notes;

    // Handle nested billing updates with dot-notation so partial billing
    // patches don't overwrite the entire sub-document.
    if (data.billing !== undefined) {
      if (data.billing.amount !== undefined)
        updateData["billing.amount"] = data.billing.amount;
      if (data.billing.status !== undefined)
        updateData["billing.status"] = data.billing.status;
      if (data.billing.insuranceDetails !== undefined) {
        if (data.billing.insuranceDetails.provider !== undefined)
          updateData["billing.insuranceDetails.provider"] =
            data.billing.insuranceDetails.provider;
        if (data.billing.insuranceDetails.policyNumber !== undefined)
          updateData["billing.insuranceDetails.policyNumber"] =
            data.billing.insuranceDetails.policyNumber;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return findById(id);
    }

    const doc = await AppointmentModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();

    return doc ? toAppointment(doc) : null;
  } catch (error) {
    if ((error as any).name === "CastError") return null;
    throw error;
  }
}

export async function updateStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment | null> {
  try {
    const doc = await AppointmentModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).exec();
    return doc ? toAppointment(doc) : null;
  } catch (error) {
    if ((error as any).name === "CastError") return null;
    throw error;
  }
}

export async function remove(id: string): Promise<boolean> {
  try {
    const result = await AppointmentModel.findByIdAndDelete(id).exec();
    return result !== null;
  } catch (error) {
    if ((error as any).name === "CastError") return false;
    throw error;
  }
}


export async function findByIdPopulated(
  id: string
): Promise<PopulatedAppointment | null> {
  try {
    const doc = await AppointmentModel.findById(id)
      .populate("clinicianId", "name credentials.specialty contact.email availability")
      .exec();
    return doc ? toPopulatedAppointment(doc) : null;
  } catch (error) {
    if ((error as any).name === "CastError") return null;
    throw error;
  }
}

export async function findAllPopulated(
  limit: number,
  offset: number,
  filters: AppointmentFilters
): Promise<{ rows: PopulatedAppointment[]; total: number }> {
  const query = buildAppointmentQuery(filters);

  const total = await AppointmentModel.countDocuments(query);

  const docs = await AppointmentModel.find(query)
    .populate("clinicianId", "name credentials.specialty contact.email availability")
    .sort({ scheduledAt: 1 })
    .skip(offset)
    .limit(limit)
    .exec();

  const rows = docs.map(toPopulatedAppointment);
  return { rows, total };
}


// Populates patient and clinician names for analytics export
export async function findForAnalytics(
  filters: AppointmentFilters
): Promise<any[]> {
  const query = buildAppointmentQuery(filters);
  const docs = await AppointmentModel.find(query)
    .populate('patientId', 'name')
    .populate('clinicianId', 'fullName name')
    .sort({ scheduledAt: 1 })
    .exec();
  return docs;
}

export default AppointmentModel;

