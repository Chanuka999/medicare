import express from "express";
import {
  getMyAppointments,
  updateAppointmentStatus,
  createMedicalRecord,
  getPatientMedicalHistory,
  getMyProfile,
  updateAvailability,
} from "../controllers/doctor.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes and restrict to doctor only
router.use(protect);
router.use(restrictTo("doctor"));

router.get("/profile", getMyProfile);
router.patch("/availability", updateAvailability);

router.get("/appointments", getMyAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);

router.post("/medical-records", createMedicalRecord);
router.get("/patients/:patientId/medical-history", getPatientMedicalHistory);

export default router;
