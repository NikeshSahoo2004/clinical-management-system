import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./db/db";
import { initializeTable } from "./models/appointmentModel";

const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  try {
    await connectDB();
    await initializeTable();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();