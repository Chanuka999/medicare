import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { sendAppointmentReminders } from "./utils/reminderScheduler.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`,
  );
  console.error("Please create a .env file based on .env.example");
  process.exit(1);
}

if (process.env.JWT_SECRET === "your_jwt_secret_here") {
  console.error(
    "❌ Please change JWT_SECRET in .env file from the default value",
  );
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Start appointment reminder scheduler (runs every 10 minutes)
  setInterval(sendAppointmentReminders, 10 * 60 * 1000);
  console.log("Appointment reminder scheduler started (runs every 10 minutes)");
};

startServer();
