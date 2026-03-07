import express from "express";
import {
  createBill,
  getAllBills,
  getMyBills,
  getBill,
  updatePayment,
} from "../controllers/billing.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// Patient can view their bills
router.get("/my-bills", restrictTo("patient"), getMyBills);

// Admin routes
router.post("/", restrictTo("admin"), createBill);
router.get("/", restrictTo("admin"), getAllBills);
router.patch("/:id/payment", restrictTo("admin"), updatePayment);

// Both admin and patient can view single bill
router.get("/:id", getBill);

export default router;
