import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// Vercel serverless handler: ensure DB connection before serving requests.
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}
