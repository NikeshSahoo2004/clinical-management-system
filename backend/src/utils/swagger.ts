import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinical Management System API",
      description:
        "REST API for managing clinical data including appointments, patients, clinicians, treatment plans and analytics.\n\n" +
        "**Database:** MongoDB (Mongoose ODM)\n\n" +
        "**Primary collections:** `appointments`, `patients`, `clinicians`, `treatmentplans`, `clinicalanalytics`\n\n" +
        "All IDs are MongoDB ObjectId strings (24-character hex).\n\n" +
        "Timestamps (`createdAt`, `updatedAt`) are managed automatically where present.",
      version: "2.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Health",
        description: "Server health check",
      },
      {
        name: "Appointments",
        description: "CRUD operations and status updates for the appointments collection",
      },
      {
        name: "Patients",
        description: "Manage patient records",
      },
      {
        name: "Clinicians",
        description: "Manage clinician records and availability",
      },
      {
        name: "TreatmentPlans",
        description: "Create and manage treatment plans for patients",
      },
      {
        name: "Analytics",
        description: "Clinical analytics, reporting, and data export",
      },
      {
        name: "Auth",
        description: "Clinician authentication (signup and login)",
      },
    ],

    paths: {
      "/health": {
        get: {
          summary: "Health check",
          tags: ["Health"],
          description: "Returns server status and current timestamp",
          responses: {
            200: {
              description: "Server is running",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                        example: "2026-03-11T10:00:00.000Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    components: {
      schemas: {
        InsuranceDetails: {
          type: "object",
          properties: {
            provider: { type: "string", example: "Blue Cross" },
            policyNumber: { type: "string", example: "POL-123456" },
          },
        },

        Billing: {
          type: "object",
          properties: {
            amount: { type: "number", example: 150 },
            status: {
              type: "string",
              enum: ["Pending", "Paid", "Insured"],
              example: "Pending",
            },
            insuranceDetails: {
              $ref: "#/components/schemas/InsuranceDetails",
            },
          },
        },

        Appointment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            patientId: {
              type: "string",
              example: "60d5ec49f1a2c72b8c8b4567",
            },
            clinicianId: {
              type: "string",
              example: "60d5ec49f1a2c72b8c8b4568",
            },
            appointmentType: {
              type: "string",
              enum: ["Consultation", "Follow-up", "Procedure"],
            },
            status: {
              type: "string",
              enum: ["Scheduled", "Completed", "Cancelled"],
            },
            scheduledAt: {
              type: "string",
              format: "date-time",
            },
            duration: {
              type: "integer",
              example: 30,
            },
            location: {
              type: "string",
              enum: ["Main Clinic", "Telehealth", "Branch Clinic"],
            },
            notes: {
              type: "string",
            },
            billing: {
              $ref: "#/components/schemas/Billing",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-11T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-11T10:30:00.000Z",
            },
          },
        },

        CreateAppointmentDTO: {
          type: "object",
          properties: {
            patientId: { type: "string" },
            clinicianId: { type: "string" },
            appointmentType: {
              type: "string",
              enum: ["Consultation", "Follow-up", "Procedure"],
            },
            status: {
              type: "string",
              enum: ["Scheduled", "Completed", "Cancelled"],
            },
            scheduledAt: {
              type: "string",
              format: "date-time",
            },
            duration: {
              type: "integer",
              description: "Duration in minutes",
              example: 30,
            },
            location: {
              type: "string",
              enum: ["Main Clinic", "Telehealth", "Branch Clinic"],
            },
            notes: {
              type: "string",
            },
            billing: {
              $ref: "#/components/schemas/Billing",
            },
          },
          required: ["patientId", "clinicianId", "appointmentType", "scheduledAt", "duration", "location"],
        },

        UpdateAppointmentDTO: {
          type: "object",
          description: "Any subset of appointment fields may be provided.",
          properties: {
            patientId: { type: "string" },
            clinicianId: { type: "string" },
            appointmentType: {
              type: "string",
              enum: ["Consultation", "Follow-up", "Procedure"],
            },
            status: {
              type: "string",
              enum: ["Scheduled", "Completed", "Cancelled"],
            },
            scheduledAt: {
              type: "string",
              format: "date-time",
            },
            duration: {
              type: "integer",
              description: "Duration in minutes",
            },
            location: {
              type: "string",
              enum: ["Main Clinic", "Telehealth", "Branch Clinic"],
            },
            notes: {
              type: "string",
            },
            billing: {
              $ref: "#/components/schemas/Billing",
            },
          },
        },

        UpdateStatusDTO: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["Scheduled", "Completed", "Cancelled"],
            },
          },
          required: ["status"],
        },

        PaginatedAppointments: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Appointment" },
            },
            total: { type: "integer", example: 42 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            totalPages: { type: "integer", example: 5 },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Appointment not found",
            },
          },
        },

        ValidationError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: { type: "string" },
            },
          },
        },

        ClinicalAnalyticsQuery: {
          type: "object",
          properties: {
            startDate: {
              type: "string",
              description: "Inclusive lower-bound for scheduledAt (ISO-8601 or YYYY-MM-DD)",
            },
            endDate: {
              type: "string",
              description: "Inclusive upper-bound for scheduledAt (ISO-8601 or YYYY-MM-DD)",
            },
            status: {
              type: "string",
              enum: ["Scheduled", "Completed", "Cancelled"],
            },
            clinicianId: { type: "string" },
            patientId: { type: "string" },
            appointmentType: {
              type: "string",
              enum: ["Consultation", "Follow-up", "Procedure"],
            },
            location: {
              type: "string",
              enum: ["Main Clinic", "Telehealth", "Branch Clinic"],
            },
            billingStatus: {
              type: "string",
              enum: ["Pending", "Paid", "Insured"],
            },
          },
        },

        AnalyticsBreakdownItem: {
          type: "object",
          properties: {
            label: { type: "string" },
            count: { type: "integer" },
          },
        },

        ClinicalAnalyticsSummary: {
          type: "object",
          properties: {
            totalAppointments: { type: "integer" },
            totalDurationMinutes: { type: "number" },
            averageDurationMinutes: { type: "number" },
            totalBillingAmount: { type: "number" },
            averageBillingAmount: { type: "number" },
            scheduledAppointments: { type: "integer" },
            completedAppointments: { type: "integer" },
            cancelledAppointments: { type: "integer" },
            paidAppointments: { type: "integer" },
            pendingAppointments: { type: "integer" },
            insuredAppointments: { type: "integer" },
          },
        },

        ClinicalAnalyticsBreakdowns: {
          type: "object",
          properties: {
            byStatus: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalyticsBreakdownItem" },
            },
            byAppointmentType: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalyticsBreakdownItem" },
            },
            byLocation: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalyticsBreakdownItem" },
            },
            byBillingStatus: {
              type: "array",
              items: { $ref: "#/components/schemas/AnalyticsBreakdownItem" },
            },
          },
        },

        ClinicalAnalyticsSnapshot: {
          type: "object",
          properties: {
            id: { type: "string" },
            signature: { type: "string" },
            filters: { $ref: "#/components/schemas/ClinicalAnalyticsQuery" },
            appointmentIds: {
              type: "array",
              items: { type: "string" },
            },
            summary: { $ref: "#/components/schemas/ClinicalAnalyticsSummary" },
            breakdowns: {
              $ref: "#/components/schemas/ClinicalAnalyticsBreakdowns",
            },
            generatedAt: {
              type: "string",
              format: "date-time",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ClinicalAnalyticsResponse: {
          type: "object",
          properties: {
            filters: { $ref: "#/components/schemas/ClinicalAnalyticsQuery" },
            summary: { $ref: "#/components/schemas/ClinicalAnalyticsSummary" },
            breakdowns: {
              $ref: "#/components/schemas/ClinicalAnalyticsBreakdowns",
            },
            appointments: {
              type: "array",
              items: { $ref: "#/components/schemas/Appointment" },
            },
            snapshot: {
              $ref: "#/components/schemas/ClinicalAnalyticsSnapshot",
            },
          },
        },

        AnalyticsExportBody: {
          allOf: [
            { $ref: "#/components/schemas/ClinicalAnalyticsQuery" },
          ],
        },
      },
    },
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };