import Review from "../models/Review.model.js";
import User from "../models/User.model.js";
import Doctor from "../models/Doctor.model.js";
import mongoose from "mongoose";

// @desc    Create a review for a doctor
// @route   POST /api/reviews
// @access  Private (Patient only)
export const createReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    // Find the Doctor document and get the userId
    const doctorDoc = await Doctor.findById(doctorId).populate("userId");
    if (!doctorDoc) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if patient already reviewed this doctor (using userId)
    const existingReview = await Review.findOne({
      doctorId: doctorDoc.userId._id,
      patientId: req.user._id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this doctor" });
    }

    // Create review (store the User ID)
    const review = await Review.create({
      doctorId: doctorDoc.userId._id,
      patientId: req.user._id,
      rating,
      comment,
    });

    // Populate patient details
    await review.populate("patientId", "name");

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all reviews for a doctor
// @route   GET /api/reviews/doctor/:doctorId
// @access  Public
export const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Find the Doctor document and get the userId
    const doctorDoc = await Doctor.findById(doctorId);
    if (!doctorDoc) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reviews = await Review.find({ doctorId: doctorDoc.userId })
      .populate("patientId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get doctor rating statistics
// @route   GET /api/reviews/doctor/:doctorId/stats
// @access  Public
export const getDoctorRatingStats = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Find the Doctor document and get the userId
    const doctorDoc = await Doctor.findById(doctorId);
    if (!doctorDoc) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    const stats = await Review.aggregate([
      {
        $match: { doctorId: new mongoose.Types.ObjectId(doctorDoc.userId) },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach((rating) => {
      distribution[rating]++;
    });

    res.json({
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: distribution,
    });
  } catch (error) {
    console.error("Error fetching rating stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Patient only - own reviews)
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if review belongs to the user
    if (review.patientId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await review.populate("patientId", "name");

    res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Patient only - own reviews)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if review belongs to the user
    if (review.patientId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Check if patient has reviewed a doctor
// @route   GET /api/reviews/check/:doctorId
// @access  Private (Patient only)
export const checkPatientReview = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Find the Doctor document and get the userId
    const doctorDoc = await Doctor.findById(doctorId);
    if (!doctorDoc) {
      return res.json({ hasReviewed: false, review: null });
    }

    const review = await Review.findOne({
      doctorId: doctorDoc.userId,
      patientId: req.user._id,
    });

    res.json({ hasReviewed: !!review, review });
  } catch (error) {
    console.error("Error checking review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
