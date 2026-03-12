import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
}

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default mongoose;
