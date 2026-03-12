import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  // Insert a test clinician
  const clinician = await db.collection("clinicians").insertOne({
    name: "Dr. Jane Smith",
    specialization: "Cardiology",
    department: "Internal Medicine",
    contactInfo: "jane.smith@clinic.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("Clinician ID:", clinician.insertedId.toString());

  // Insert a test patient
  const patient = await db.collection("patients").insertOne({
    name: "John Doe",
    dateOfBirth: new Date("1990-05-15"),
    contactInfo: "john.doe@email.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("Patient ID:", patient.insertedId.toString());

  await mongoose.disconnect();
  console.log("Done — use these IDs in your POST /api/appointments requests");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
