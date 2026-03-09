import Appointment from "../models/Appointment.model.js";
import Notification from "../models/Notification.model.js";
import Doctor from "../models/Doctor.model.js";
import User from "../models/User.model.js";

// Send appointment reminders
export const sendAppointmentReminders = async () => {
  try {
    const now = new Date();

    // Check for 24-hour reminders
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const before24Hours = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);

    // Check for 1-hour reminders
    const in1Hour = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const before1Hour = new Date(now.getTime() + 0.5 * 60 * 60 * 1000);

    // Fetch appointments in specified time windows
    const appointmentsFor24h = await Appointment.find({
      appointmentDate: {
        $gte: before24Hours,
        $lte: in24Hours,
      },
      status: "scheduled",
    }).populate("patientId doctorId");

    const appointmentsFor1h = await Appointment.find({
      appointmentDate: {
        $gte: before1Hour,
        $lte: in1Hour,
      },
      status: "scheduled",
    }).populate("patientId doctorId");

    // Process 24-hour reminders
    for (const appointment of appointmentsFor24h) {
      await createReminderNotification(appointment, "appointment-reminder-24h");
    }

    // Process 1-hour reminders
    for (const appointment of appointmentsFor1h) {
      await createReminderNotification(appointment, "appointment-reminder-1h");
    }

    console.log(
      `[${new Date().toISOString()}] Reminder scheduler executed successfully`,
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error in reminder scheduler:`,
      error,
    );
  }
};

// Helper function to create reminder notifications
const createReminderNotification = async (appointment, type) => {
  try {
    const isAlreadySent = await Notification.findOne({
      appointmentId: appointment._id,
      type,
    });

    if (isAlreadySent) {
      return; // Notification already sent
    }

    const timeFrame =
      type === "appointment-reminder-24h" ? "24 hours" : "1 hour";
    const doctorName = appointment.doctorId?.name || "Your Doctor";
    const patientName = appointment.patientId?.name || "Your Patient";

    // Notification for patient
    await Notification.create({
      appointmentId: appointment._id,
      recipientId: appointment.patientId._id,
      recipientRole: "patient",
      type,
      title: `Appointment Reminder - ${timeFrame}`,
      message: `Your appointment with Dr. ${doctorName} is scheduled in ${timeFrame} on ${appointment.appointmentDate.toLocaleDateString()} at ${appointment.timeSlot.startTime}.`,
      status: "sent",
    });

    // Notification for doctor
    const doctorUser = await User.findOne({ doctor: appointment.doctorId._id });
    if (doctorUser) {
      await Notification.create({
        appointmentId: appointment._id,
        recipientId: doctorUser._id,
        recipientRole: "doctor",
        type,
        title: `Appointment Reminder - ${timeFrame}`,
        message: `You have an appointment with ${patientName} scheduled in ${timeFrame} on ${appointment.appointmentDate.toLocaleDateString()} at ${appointment.timeSlot.startTime}.`,
        status: "sent",
      });
    }

    console.log(
      `Reminder notifications created for appointment ${appointment._id} (${type})`,
    );
  } catch (error) {
    console.error("Error creating reminder notifications:", error);
  }
};
