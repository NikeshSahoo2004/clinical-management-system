import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  instructions: { type: String }
});

const followUpSchema = new mongoose.Schema({
  scheduledDate: { type: Date, required: true },
  purpose: { type: String, required: true },
  status: { type: String, default: "Pending" }
});

const referralSchema = new mongoose.Schema({
  specialist: String,
  reason: String
});

const treatmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient"
    },

    clinicianId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Clinician"
    },

    diagnosis: {
      condition: String,
      diagnosedAt: Date,
      icd10Code: String
    },

    prescriptions: [prescriptionSchema],

    followUps: [followUpSchema],

    recommendations: {
      lifestyleChanges: [String],
      referrals: [referralSchema]
    }
  },
  { timestamps: true }
);

export const TreatmentPlan = mongoose.model("TreatmentPlan", treatmentSchema);