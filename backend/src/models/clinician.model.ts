import mongoose, { Document, Schema } from "mongoose";

export interface IClinician extends Document {
  fullName: string;
  email: string;
  phone?: string;
  name?: {
    firstName?: string;
    lastName?: string;
    title?: string;
  };
  credentials?: {
    licenseNumber?: string;
    specialty?: string;
    certifications?: {
      name?: string;
      issuedBy?: string;
      issueDate?: Date;
    }[];
  };
  contact?: {
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
  availability?: {
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const clinicianSchema = new Schema<IClinician>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },

    // Existing clinician profile structure (kept for compatibility)
    name: {
      firstName: String,
      lastName: String,
      title: String,
    },
    credentials: {
      licenseNumber: String,
      specialty: String,
      certifications: [
        {
          name: String,
          issuedBy: String,
          issueDate: Date,
        },
      ],
    },
    contact: {
      email: String,
      phone: String,
      officeAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },
    availability: [
      {
        dayOfWeek: String,
        startTime: String,
        endTime: String,
        location: String,
      },
    ],
  },
  { timestamps: true }
);

export const Clinician = mongoose.model<IClinician>("Clinician", clinicianSchema);