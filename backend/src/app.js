import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// Root route - API welcome message
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MediFlow Hospital Management System API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      admin: "/api/admin",
      patient: "/api/patient",
      doctor: "/api/doctor",
      billing: "/api/billing",
      reviews: "/api/reviews",
      notifications: "/api/notifications",
    },
    documentation: "See API_DOCUMENTATION.md for details",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "MediFlow HMS API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
