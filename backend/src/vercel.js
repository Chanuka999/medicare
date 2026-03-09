import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

let isDbConnected = false;

// Vercel serverless handler: ensure DB connection before serving requests.
export default async function handler(req, res) {
  try {
    if (!isDbConnected) {
      await connectDB();
      isDbConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
