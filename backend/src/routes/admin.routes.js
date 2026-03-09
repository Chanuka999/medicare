import express from "express";
import {
  getAllUsers,
  createDoctor,
  getAllDoctors,
  updateDoctor,
  updateUserStatus,
  getDashboardStats,
  getDailyAppointments,
  getMonthlyRevenue,
  getMostVisitedDoctors,
  getPatientGrowth,
} from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes and restrict to admin only
router.use(protect);
router.use(restrictTo("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);

router.post("/doctors", createDoctor);
router.get("/doctors", getAllDoctors);
router.patch("/doctors/:id", updateDoctor);

router.get("/dashboard/stats", getDashboardStats);
router.get("/statistics/daily-appointments", getDailyAppointments);
router.get("/statistics/monthly-revenue", getMonthlyRevenue);
router.get("/statistics/most-visited-doctors", getMostVisitedDoctors);
router.get("/statistics/patient-growth", getPatientGrowth);

export default router;
