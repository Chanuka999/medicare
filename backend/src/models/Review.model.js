import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// Index for querying reviews by doctor
reviewSchema.index({ doctorId: 1, createdAt: -1 });

// Prevent duplicate review from same patient to same doctor
reviewSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
