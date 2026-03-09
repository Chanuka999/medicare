import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(protect); // All routes require authentication

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:id/read", markAsRead);
router.put("/mark-all-read", markAllAsRead);
router.delete("/:id", deleteNotification);
router.delete("/", clearAllNotifications);

export default router;
