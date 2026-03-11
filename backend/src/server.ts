import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDatabase } from "./db/db";
import { initializeTable } from "./models/appointmentModel";

const PORT = process.env.PORT || 3000;

async function start(): Promise<void> {
  try {
    await connectDatabase();
    await initializeTable();

    app.listen(PORT, () => {
      console.log(`🚀Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
