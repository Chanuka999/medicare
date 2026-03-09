import User from "../models/User.model.js";
import Doctor from "../models/Doctor.model.js";
import Appointment from "../models/Appointment.model.js";

// Get all users (staff management)
export const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .select("-password")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create doctor profile
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      qualifications,
      experience,
      consultationFee,
      availability,
    } = req.body;

    // Create user account
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "doctor",
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      licenseNumber,
      qualifications,
      experience,
      consultationFee,
      availability,
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: { doctor },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate(
      "userId",
      "name email phone status",
    );

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

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: { doctor },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Dashboard analytics
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await Doctor.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const totalAppointments = await Appointment.countDocuments();

    const [userRoleRaw, appointmentStatusRaw, monthlyAppointmentsRaw] =
      await Promise.all([
        User.aggregate([
          { $group: { _id: "$role", count: { $sum: 1 } } },
          { $project: { _id: 0, role: "$_id", count: 1 } },
        ]),
        Appointment.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $project: { _id: 0, status: "$_id", count: 1 } },
        ]),
        Appointment.aggregate([
          {
            $match: {
              createdAt: { $gte: sixMonthsAgo, $lte: now },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
      ]);

    const userRoleMap = userRoleRaw.reduce((acc, item) => {
      acc[item.role] = item.count;
      return acc;
    }, {});

    const appointmentStatusMap = appointmentStatusRaw.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {});

    const monthlyMap = monthlyAppointmentsRaw.reduce((acc, item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      acc[key] = item.count;
      return acc;
    }, {});

    const monthlyAppointments = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return {
        month: date.toLocaleString("en-US", { month: "short" }),
        year: date.getFullYear(),
        count: monthlyMap[key] || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalAdmins,
        activeUsers,
        totalAppointments,
        userRoleCounts: {
          admin: userRoleMap.admin || 0,
          doctor: userRoleMap.doctor || 0,
          patient: userRoleMap.patient || 0,
        },
        appointmentStatusCounts: {
          scheduled: appointmentStatusMap.scheduled || 0,
          completed: appointmentStatusMap.completed || 0,
          cancelled: appointmentStatusMap.cancelled || 0,
          noShow: appointmentStatusMap["no-show"] || 0,
        },
        monthlyAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
