import express from "express";
import {
  getDoctors,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getMyMedicalRecords,
} from "../controllers/patient.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes and restrict to patient only
router.use(protect);
router.use(restrictTo("patient"));

router.get("/doctors", getDoctors);

router.post("/appointments", bookAppointment);
router.get("/appointments", getMyAppointments);
router.patch("/appointments/:id/cancel", cancelAppointment);

router.get("/medical-records", getMyMedicalRecords);

export default router;
