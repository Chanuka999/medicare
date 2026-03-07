import Bill from "../models/Bill.model.js";
import Appointment from "../models/Appointment.model.js";

// Create bill
export const createBill = async (req, res) => {
  try {
    const { patientId, appointmentId, items, subtotal, tax, discount, paymentMethod, notes } =
      req.body;

    const totalAmount = subtotal + tax - discount;
    const dueAmount = totalAmount;

    const bill = await Bill.create({
      patientId,
      appointmentId,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      dueAmount,
      paymentMethod,
      notes,
    });

    await bill.populate([
      { path: "patientId", select: "name email phone" },
      { path: "appointmentId" },
    ]);

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: { bill },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all bills (admin)
export const getAllBills = async (req, res) => {
  try {
    const { paymentStatus, patientId } = req.query;
    const filter = {};

    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (patientId) filter.patientId = patientId;

    const bills = await Bill.find(filter)
      .populate("patientId", "name email phone")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bills.length,
      data: { bills },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get patient bills
export const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ patientId: req.user.id })
      .populate("appointmentId")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: bills.length,
      data: { bills },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single bill
export const getBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findById(id)
      .populate("patientId", "name email phone address")
      .populate("appointmentId");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    // Check if user is authorized to view this bill
    if (
      req.user.role === "patient" &&
      bill.patientId._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this bill",
      });
    }

    res.status(200).json({
      success: true,
      data: { bill },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update payment status
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paidAmount, paymentMethod, paymentDate } = req.body;

    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    bill.paymentStatus = paymentStatus;
    bill.paidAmount = paidAmount;
    bill.dueAmount = bill.totalAmount - paidAmount;
    bill.paymentMethod = paymentMethod;
    bill.paymentDate = paymentDate || new Date();

    await bill.save();

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: { bill },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
