import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
    },
    qualifications: [String],
    experience: {
      type: Number,
      default: 0,
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
    },
    availability: {
      type: [
        {
          day: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          },
          slots: [
            {
              startTime: String,
              endTime: String,
              isBooked: { type: Boolean, default: false },
            },
          ],
        },
      ],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalPatients: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
