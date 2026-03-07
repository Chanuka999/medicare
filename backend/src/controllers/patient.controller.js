import Appointment from "../models/Appointment.model.js";
import Doctor from "../models/Doctor.model.js";
import MedicalRecord from "../models/MedicalRecord.model.js";

// Get all doctors (for booking)
export const getDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    const filter = {};

    if (specialization) filter.specialization = specialization;

    const doctors = await Doctor.find(filter)
      .populate("userId", "name email phone profileImage")
      .sort("-rating");

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: { doctors },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason, priority } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      "timeSlot.startTime": timeSlot.startTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Time slot already booked",
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      priority: priority || "normal",
    });

    await appointment.populate([
      { path: "patientId", select: "name email phone" },
      { path: "doctorId", populate: { path: "userId", select: "name email" } },
    ]);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get patient appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email phone" },
      })
      .sort("-appointmentDate");

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

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findOne({
      _id: id,
      patientId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    appointment.status = "cancelled";
    appointment.cancelledBy = req.user.id;
    appointment.cancellationReason = cancellationReason;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get patient medical records
export const getMyMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user.id })
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
