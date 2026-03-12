import mongoose, { Schema, Document } from "mongoose";

/**
 * Minimal Clinician model – registered so that Mongoose `.populate('clinicianId')`
 * can resolve references from the appointments collection.
 *
 * The schema is intentionally relaxed (`strict: false`) so it can read whatever
 * fields exist in the clinicians collection without needing an exhaustive definition.
 */

export interface ClinicianDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: {
    firstName: string;
    lastName: string;
    title?: string;
  };
  credentials: {
    licenseNumber?: string;
    specialty?: string;
    certifications?: Array<{
      name: string;
      issuedBy: string;
      issueDate: string;
    }>;
  };
  contact: {
    email?: string;
    phone?: string;
    officeAddress?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  availability?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    location: string;
  }>;
}

const clinicianSchema = new Schema<ClinicianDocument>(
  {
    name: {
      firstName: { type: String },
      lastName: { type: String },
      title: { type: String },
    },
    credentials: {
      licenseNumber: { type: String },
      specialty: { type: String },
      certifications: { type: [Schema.Types.Mixed] },
    },
    contact: {
      email: { type: String },
      phone: { type: String },
      officeAddress: { type: Schema.Types.Mixed },
    },
    availability: { type: [Schema.Types.Mixed] },
  },
  {
    collection: "clinicians",
    strict: false,
    toJSON: {
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

const ClinicianModel = mongoose.model<ClinicianDocument>(
  "Clinician",
  clinicianSchema
);

export default ClinicianModel;
