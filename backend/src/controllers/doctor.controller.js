import Appointment from "../models/Appointment.model.js";
import MedicalRecord from "../models/MedicalRecord.model.js";
import Doctor from "../models/Doctor.model.js";
import Review from "../models/Review.model.js";
import mongoose from "mongoose";

// Get doctor's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;

    // Find doctor profile
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const filter = { doctorId: doctor._id };
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate("patientId", "name email phone gender dateOfBirth")
      .sort("appointmentDate timeSlot.startTime");

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).populate("patientId", "name email phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create medical record / prescription
export const createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      diagnosis,
      symptoms,
      prescription,
      labTests,
      vitalSigns,
      notes,
      followUpDate,
    } = req.body;

    // Find doctor profile
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const medicalRecord = await MedicalRecord.create({
      patientId,
      doctorId: doctor._id,
      appointmentId,
      diagnosis,
      symptoms,
      prescription,
      labTests,
      vitalSigns,
      notes,
      followUpDate,
    });

    // Update appointment status to completed if provided
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: "completed",
      });
    }

    await medicalRecord.populate([
      { path: "patientId", select: "name email phone" },
      {
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: { medicalRecord },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get patient medical history
export const getPatientMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.find({ patientId })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name specialization" },
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: records.length,
      data: { records },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get doctor profile
export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate(
      "userId",
      "name email phone profileImage",
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    // Calculate total unique patients
    const uniquePatients = await Appointment.distinct("patientId", {
      doctorId: doctor._id,
    });
    const totalPatients = uniquePatients.length;

    // Calculate average rating from reviews
    const ratingStats = await Review.aggregate([
      {
        $match: { doctorId: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const rating =
      ratingStats.length > 0
        ? Math.round(ratingStats[0].averageRating * 10) / 10
        : 0;
    const totalReviews =
      ratingStats.length > 0 ? ratingStats[0].totalReviews : 0;

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          ...doctor.toObject(),
          totalPatients,
          rating,
          totalReviews,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update doctor availability
export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      { availability },
      { new: true, runValidators: true },
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: { doctor },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
