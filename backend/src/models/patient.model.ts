import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  name: string;
  age: number;
  address: string;
  phoneNumber: string;
  clinicianId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    clinicianId: {
      type: Schema.Types.ObjectId,
      ref: "Clinician",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Patient = mongoose.model<IPatient>(
  "Patient",
  patientSchema
);