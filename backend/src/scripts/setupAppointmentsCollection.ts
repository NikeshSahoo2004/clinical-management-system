/**
 * Setup script for the appointments collection.
 *
 * Applies MongoDB JSON schema validation, creates indexes, and prints
 * example insert / query statements.
 *
 * Usage:
 *   npx ts-node src/scripts/setupAppointmentsCollection.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

async function setup() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;
  console.log("Connected to MongoDB\n");

  // ─────────────────────────────────────────────────────────────────────────
  // 1. MongoDB JSON Schema Validation
  // ─────────────────────────────────────────────────────────────────────────

  const validator = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "patientId",
        "clinicianId",
        "appointmentType",
        "status",
        "scheduledAt",
        "duration",
        "location",
      ],
      properties: {
        _id: { bsonType: "objectId" },
        patientId: {
          bsonType: "objectId",
          description: "Reference to patients._id – required",
        },
        clinicianId: {
          bsonType: "objectId",
          description: "Reference to clinicians._id – required",
        },
        appointmentType: {
          bsonType: "string",
          enum: ["Consultation", "Follow-up", "Procedure"],
          description: "Type of appointment – required",
        },
        status: {
          bsonType: "string",
          enum: ["Scheduled", "Completed", "Cancelled"],
          description: "Current appointment status",
        },
        scheduledAt: {
          bsonType: "date",
          description: "Appointment date/time – must be a valid date",
        },
        duration: {
          bsonType: ["int", "double"],
          minimum: 1,
          description: "Duration in minutes – must be a positive number",
        },
        location: {
          bsonType: "string",
          enum: ["Main Clinic", "Telehealth", "Branch Clinic"],
          description: "Appointment location – required",
        },
        notes: {
          bsonType: "string",
          description: "Optional appointment notes",
        },
        billing: {
          bsonType: "object",
          properties: {
            amount: {
              bsonType: ["int", "double"],
              minimum: 0,
              description: "Billing amount – non-negative number",
            },
            status: {
              bsonType: "string",
              enum: ["Pending", "Paid", "Insured"],
            },
            insuranceDetails: {
              bsonType: "object",
              properties: {
                provider: {
                  bsonType: ["string", "null"],
                  description: "Insurance provider name or null",
                },
                policyNumber: {
                  bsonType: ["string", "null"],
                  description: "Insurance policy number or null",
                },
              },
            },
          },
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  };

  const collections = await db
    .listCollections({ name: "appointments" })
    .toArray();

  if (collections.length === 0) {
    await db.createCollection("appointments", { validator });
    console.log(
      "✅ Created 'appointments' collection with JSON schema validation"
    );
  } else {
    await db.command({
      collMod: "appointments",
      validator,
      validationLevel: "moderate",
      validationAction: "error",
    });
    console.log(
      "✅ Updated 'appointments' collection with JSON schema validation"
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Index Creation
  // ─────────────────────────────────────────────────────────────────────────

  const col = db.collection("appointments");

  await col.createIndex({ clinicianId: 1 }, { name: "idx_clinicianId" });
  console.log("✅ Index created: clinicianId");

  await col.createIndex({ patientId: 1 }, { name: "idx_patientId" });
  console.log("✅ Index created: patientId");

  await col.createIndex({ scheduledAt: 1 }, { name: "idx_scheduledAt" });
  console.log("✅ Index created: scheduledAt");

  await col.createIndex({ status: 1 }, { name: "idx_status" });
  console.log("✅ Index created: status");

  await col.createIndex(
    { clinicianId: 1, scheduledAt: 1 },
    { name: "idx_clinicianId_scheduledAt" }
  );
  console.log("✅ Compound index created: clinicianId + scheduledAt\n");

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Appointment Document Structure
  // ─────────────────────────────────────────────────────────────────────────

  console.log("── Appointment document structure ──");
  console.log(
    JSON.stringify(
      {
        _id: "ObjectId",
        patientId: "ObjectId → patients._id",
        clinicianId: "ObjectId → clinicians._id",
        appointmentType: "Consultation | Follow-up | Procedure",
        status: "Scheduled | Completed | Cancelled",
        scheduledAt: "ISODate",
        duration: "number (minutes, positive)",
        location: "Main Clinic | Telehealth | Branch Clinic",
        notes: "string (optional)",
        billing: {
          amount: "number (≥ 0)",
          status: "Pending | Paid | Insured",
          insuranceDetails: {
            provider: "string | null",
            policyNumber: "string | null",
          },
        },
        createdAt: "ISODate (auto)",
        updatedAt: "ISODate (auto)",
      },
      null,
      2
    )
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Example Insert Query (referencing a real clinicianId)
  // ─────────────────────────────────────────────────────────────────────────

  const existingClinician = await db.collection("clinicians").findOne({});

  if (existingClinician) {
    console.log(
      `\n── Example insert referencing clinician ${existingClinician._id} ──`
    );
    console.log(`
  db.appointments.insertOne({
    patientId:       ObjectId("000000000000000000000001"),
    clinicianId:     ObjectId("${existingClinician._id}"),  // ← real clinician reference
    appointmentType: "Consultation",
    status:          "Scheduled",
    scheduledAt:     ISODate("2026-04-01T09:00:00Z"),
    duration:        30,
    location:        "Main Clinic",
    notes:           "Initial consultation",
    billing: {
      amount: 150,
      status: "Pending",
      insuranceDetails: {
        provider:     "BlueCross",
        policyNumber: "BC-12345"
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });
`);
  } else {
    console.log(
      "\n⚠️  No clinicians found. Showing example with placeholder:"
    );
    console.log(`
  db.appointments.insertOne({
    patientId:       ObjectId("000000000000000000000001"),
    clinicianId:     ObjectId("<clinicians._id>"),
    appointmentType: "Consultation",
    status:          "Scheduled",
    scheduledAt:     ISODate("2026-04-01T09:00:00Z"),
    duration:        30,
    location:        "Main Clinic",
    notes:           "Initial consultation",
    billing: {
      amount: 150,
      status: "Pending",
      insuranceDetails: {
        provider:     "BlueCross",
        policyNumber: "BC-12345"
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });
`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Example Queries
  // ─────────────────────────────────────────────────────────────────────────

  const cid = existingClinician
    ? `ObjectId("${existingClinician._id}")`
    : 'ObjectId("<clinicianId>")';

  console.log("── Fetch all appointments for a clinician ──");
  console.log(`
  db.appointments.find({ clinicianId: ${cid} })
    .sort({ scheduledAt: 1 });
`);

  console.log("── Upcoming scheduled appointments for a clinician ──");
  console.log(`
  db.appointments.find({
    clinicianId: ${cid},
    status: "Scheduled",
    scheduledAt: { $gte: new Date() }
  }).sort({ scheduledAt: 1 });
`);

  console.log("── Aggregate: count appointments per status for a clinician ──");
  console.log(`
  db.appointments.aggregate([
    { $match: { clinicianId: ${cid} } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
`);

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Index Creation Queries (raw MongoDB equivalent)
  // ─────────────────────────────────────────────────────────────────────────

  console.log("── Raw MongoDB index creation commands ──");
  console.log(`
  db.appointments.createIndex({ clinicianId: 1 },                { name: "idx_clinicianId" });
  db.appointments.createIndex({ patientId: 1 },                  { name: "idx_patientId" });
  db.appointments.createIndex({ scheduledAt: 1 },                { name: "idx_scheduledAt" });
  db.appointments.createIndex({ status: 1 },                     { name: "idx_status" });
  db.appointments.createIndex({ clinicianId: 1, scheduledAt: 1 },{ name: "idx_clinicianId_scheduledAt" });
`);

  // ── Verify ────────────────────────────────────────────────────────────────

  const indexes = await col.indexes();
  console.log("── Current indexes on appointments ──");
  console.log(JSON.stringify(indexes, null, 2));

  await mongoose.disconnect();
  console.log("\n✅ Setup complete. Disconnected.");
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
