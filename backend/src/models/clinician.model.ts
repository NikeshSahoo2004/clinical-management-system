import mongoose from "mongoose";

const clinicianSchema = new mongoose.Schema({

  name: {
    firstName: String,
    lastName: String,
    title: String
  },

  credentials: {
    licenseNumber: String,
    specialty: String,
    certifications: [
      {
        name: String,
        issuedBy: String,
        issueDate: Date
      }
    ]
  },

  contact: {
    email: String,
    phone: String,
    officeAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },

  availability: [
    {
      dayOfWeek: String,
      startTime: String,
      endTime: String,
      location: String
    }
  ]

}, { timestamps: true });

export const Clinician = mongoose.model("Clinician", clinicianSchema);