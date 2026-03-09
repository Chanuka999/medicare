import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },
    type: {
      type: String,
      enum: ["appointment-reminder-24h", "appointment-reminder-1h"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "read", "failed"],
      default: "sent",
    },
    deliveryTime: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Index for efficient querying
notificationSchema.index({ recipientId: 1, status: 1 });
notificationSchema.index({ appointmentId: 1 });
notificationSchema.index({ createdAt: 1 });

export default mongoose.model("Notification", notificationSchema);
