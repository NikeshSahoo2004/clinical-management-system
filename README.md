# Clinical Management System

A REST API for managing clinical appointments, built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

## Features

- Full CRUD for appointments (create, read, update, delete)
- Appointment status management with valid state transitions
- Clinician listing for quick ID lookup
- Double-booking prevention (overlap detection)
- Referential integrity checks (clinician & patient must exist)
- Clinical analytics with customizable filters and aggregation
- Export analytics as CSV or PDF
- Pagination, filtering, and date-range queries
- Clinician population (expand clinician details in appointment responses)
- Interactive Swagger UI documentation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | MongoDB (Mongoose ODM) |
| Docs | Swagger / OpenAPI 3.0 |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas connection string)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy the example file and fill in your MongoDB URI:

```bash
cp .env.example .env
```

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
PORT=3000
```

### Seed Test Data (Optional)

```bash
# Seed clinician & patient
npx ts-node src/scripts/seedTestData.ts

# Seed analytics test records
npx ts-node src/scripts/seedAnalyticsData.ts
```

This creates test data and prints IDs for use in API requests.

### Run

```bash
# Development (with hot-reload)
npm run dev

# Production
npm run build
npm start
```

### API Documentation

Once the server is running, open:

```
http://localhost:3000/api-docs
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/clinicians` | List all clinicians |
| `GET` | `/api/clinicians/:id` | Get clinician by ID |
| `GET` | `/api/appointments` | List appointments (paginated, filterable) |
| `GET` | `/api/appointments/:id` | Get appointment by ID |
| `POST` | `/api/appointments` | Create appointment |
| `PUT` | `/api/appointments/:id` | Update appointment |
| `PATCH` | `/api/appointments/:id/status` | Update appointment status |
| `DELETE` | `/api/appointments/:id` | Delete appointment |
| `GET` | `/api/analytics` | Fetch analytics (paginated, filterable) |
| `GET` | `/api/analytics/summary` | Metric summary counts |
| `GET` | `/api/analytics/:id` | Get analytics record by ID |
| `POST` | `/api/analytics` | Create analytics record |
| `PUT` | `/api/analytics/:id` | Update analytics record |
| `DELETE` | `/api/analytics/:id` | Delete analytics record |
| `POST` | `/api/analytics/export` | Export analytics as CSV or PDF |

See [docs/ANALYTICS_ENDPOINTS.md](docs/ANALYTICS_ENDPOINTS.md) for detailed analytics usage with examples.

## Project Structure

```
backend/
├── src/
│   ├── app.ts                  # Express app setup & middleware
│   ├── server.ts               # Entry point (connect DB → start server)
│   ├── swagger.ts              # OpenAPI / Swagger config
│   ├── controllers/            # Request handlers
│   ├── db/                     # Database connection
│   ├── models/                 # Mongoose schemas & data-access
│   ├── routes/                 # Express route definitions
│   ├── scripts/                # DB setup & seed scripts
│   ├── services/               # Business logic
│   ├── types/                  # TypeScript interfaces & enums
│   ├── utils/                  # Helpers (pagination, dates)
│   └── validators/             # Request validation middleware
├── package.json
└── tsconfig.json
```

## License

ISC
