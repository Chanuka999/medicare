import express from "express";
import {
  createReview,
  getDoctorReviews,
  getDoctorRatingStats,
  updateReview,
  deleteReview,
  checkPatientReview,
} from "../controllers/review.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/doctor/:doctorId", getDoctorReviews);
router.get("/doctor/:doctorId/stats", getDoctorRatingStats);

// Protected routes - Patient only
router.use(protect);
router.post("/", restrictTo("patient"), createReview);
router.get("/check/:doctorId", restrictTo("patient"), checkPatientReview);
router.put("/:id", restrictTo("patient"), updateReview);
router.delete("/:id", restrictTo("patient"), deleteReview);

export default router;
