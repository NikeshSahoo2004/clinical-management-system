import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinical Management System API",
      description:
        "REST API for managing clinical appointments.\n\n" +
        "**Database:** MongoDB (Mongoose ODM)\n\n" +
        "**Collection:** `appointments`\n\n" +
        "All IDs are MongoDB ObjectId strings (24-character hex).\n\n" +
        "Timestamps (`createdAt`, `updatedAt`) are managed automatically.",
      version: "2.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],

    tags: [
      {
        name: "Health",
        description: "Server health check",
      },
      {
        name: "Appointments",
        description: "CRUD operations for the appointments collection",
      },
      {
        name: "Clinicians",
        description: "Read-only access to the clinicians collection",
      },
      {
        name: "Analytics",
        description: "Clinical analytics, reporting, and data export",
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
      },
    },
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };