import mongoose, { Schema, Document } from "mongoose";
import {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentStatus,
} from "../types/appointmentTypes";

export interface AppointmentDocument extends Omit<Appointment, "id">, Document {
  _id: mongoose.Types.ObjectId;
}

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    patient_name: {
      type: String,
      required: true,
      trim: true,
    },
    doctor_name: {
      type: String,
      required: true,
      trim: true,
    },
    appointment_date: {
      type: String,
      required: true,
    },
    appointment_time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

appointmentSchema.index({ appointment_date: 1, appointment_time: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ doctor_name: 1 });
appointmentSchema.index({ patient_name: 1 });

const AppointmentModel = mongoose.model<AppointmentDocument>("Appointment", appointmentSchema);

function toAppointment(doc: AppointmentDocument): Appointment {
  const obj = doc.toJSON();
  return {
    id: obj.id,
    patient_name: obj.patient_name,
    doctor_name: obj.doctor_name,
    appointment_date: obj.appointment_date,
    appointment_time: obj.appointment_time,
    status: obj.status as AppointmentStatus,
    reason: obj.reason,
    created_at: obj.created_at,
    updated_at: obj.updated_at,
  };
}

export async function initializeTable(): Promise<void> {
  await AppointmentModel.ensureIndexes();
}

export async function findAll(
  limit: number,
  offset: number,
  filters: { status?: string; doctor_name?: string; patient_name?: string; date?: string }
): Promise<{ rows: Appointment[]; total: number }> {
  const query: Record<string, any> = {};

  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.doctor_name) {
    query.doctor_name = { $regex: filters.doctor_name, $options: "i" };
  }
  if (filters.patient_name) {
    query.patient_name = { $regex: filters.patient_name, $options: "i" };
  }
  if (filters.date) {
    query.appointment_date = filters.date;
  }

  const total = await AppointmentModel.countDocuments(query);

  const docs = await AppointmentModel.find(query)
    .sort({ appointment_date: 1, appointment_time: 1 })
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
    if ((error as any).name === "CastError") {
      return null;
    }
    throw error;
  }
}

export async function create(data: CreateAppointmentDTO): Promise<Appointment> {
  const doc = await AppointmentModel.create({
    patient_name: data.patient_name,
    doctor_name: data.doctor_name,
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time,
    status: data.status || "scheduled",
    reason: data.reason,
  });

  return toAppointment(doc);
}

export async function update(id: string, data: UpdateAppointmentDTO): Promise<Appointment | null> {
  try {
    const updateData: Record<string, any> = {};

    if (data.patient_name !== undefined) {
      updateData.patient_name = data.patient_name;
    }
    if (data.doctor_name !== undefined) {
      updateData.doctor_name = data.doctor_name;
    }
    if (data.appointment_date !== undefined) {
      updateData.appointment_date = data.appointment_date;
    }
    if (data.appointment_time !== undefined) {
      updateData.appointment_time = data.appointment_time;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.reason !== undefined) {
      updateData.reason = data.reason;
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
    if ((error as any).name === "CastError") {
      return null;
    }
    throw error;
  }
}

export async function remove(id: string): Promise<boolean> {
  try {
    const result = await AppointmentModel.findByIdAndDelete(id).exec();
    return result !== null;
  } catch (error) {
    if ((error as any).name === "CastError") {
      return false;
    }
    throw error;
  }
}

export default AppointmentModel;

