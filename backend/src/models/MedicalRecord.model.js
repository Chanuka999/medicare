import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
    },
    symptoms: [String],
    prescription: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: String,
      },
    ],
    labTests: [
      {
        testName: String,
        result: String,
        testDate: Date,
        reportUrl: String,
      },
    ],
    vitalSigns: {
      bloodPressure: String,
      heartRate: String,
      temperature: String,
      weight: String,
      height: String,
    },
    notes: {
      type: String,
      default: "",
    },
    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for patient medical history
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;
