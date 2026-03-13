import mongoose, { Document, Schema } from "mongoose";

export interface IClinicianAuth extends Document {
  clinicianId: mongoose.Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const clinicianAuthSchema = new Schema<IClinicianAuth>(
  {
    clinicianId: {
      type: Schema.Types.ObjectId,
      ref: "Clinician",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ClinicianAuth = mongoose.model<IClinicianAuth>(
  "ClinicianAuth",
  clinicianAuthSchema
);

