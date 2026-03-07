import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.model.js";
import Doctor from "./src/models/Doctor.model.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data (optional - comment out to keep existing data)
    await User.deleteMany({});
    await Doctor.deleteMany({});
    console.log("Existing data cleared");

    // Create Admin User
    const admin = await User.create({
      name: "Admin User",
      email: "admin@mediflow.com",
      password: "admin123",
      phone: "0771234567",
      role: "admin",
      gender: "male",
      status: "active",
    });
    console.log("✓ Admin user created");

    // Create Sample Doctors
    const doctorUsers = await User.insertMany([
      {
        name: "Dr. Nimal Perera",
        email: "nimal@mediflow.com",
        password: "doctor123",
        phone: "0771234568",
        role: "doctor",
        gender: "male",
        status: "active",
      },
      {
        name: "Dr. Kamani Silva",
        email: "kamani@mediflow.com",
        password: "doctor123",
        phone: "0771234569",
        role: "doctor",
        gender: "female",
        status: "active",
      },
      {
        name: "Dr. Rohan Fernando",
        email: "rohan@mediflow.com",
        password: "doctor123",
        phone: "0771234570",
        role: "doctor",
        gender: "male",
        status: "active",
      },
    ]);
    console.log("✓ Doctor users created");

    // Create Doctor Profiles
    await Doctor.insertMany([
      {
        userId: doctorUsers[0]._id,
        specialization: "Cardiology",
        licenseNumber: "MED-2020-001",
        qualifications: ["MBBS", "MD (Cardiology)", "MRCP"],
        experience: 10,
        consultationFee: 3000,
        availability: [
          {
            day: "Monday",
            slots: [
              { startTime: "09:00", endTime: "10:00", isBooked: false },
              { startTime: "10:00", endTime: "11:00", isBooked: false },
              { startTime: "11:00", endTime: "12:00", isBooked: false },
            ],
          },
          {
            day: "Wednesday",
            slots: [
              { startTime: "14:00", endTime: "15:00", isBooked: false },
              { startTime: "15:00", endTime: "16:00", isBooked: false },
            ],
          },
        ],
        rating: 4.5,
      },
      {
        userId: doctorUsers[1]._id,
        specialization: "Pediatrics",
        licenseNumber: "MED-2019-045",
        qualifications: ["MBBS", "MD (Pediatrics)", "DCH"],
        experience: 8,
        consultationFee: 2500,
        availability: [
          {
            day: "Tuesday",
            slots: [
              { startTime: "09:00", endTime: "10:00", isBooked: false },
              { startTime: "10:00", endTime: "11:00", isBooked: false },
            ],
          },
          {
            day: "Thursday",
            slots: [
              { startTime: "14:00", endTime: "15:00", isBooked: false },
              { startTime: "15:00", endTime: "16:00", isBooked: false },
              { startTime: "16:00", endTime: "17:00", isBooked: false },
            ],
          },
        ],
        rating: 4.8,
      },
      {
        userId: doctorUsers[2]._id,
        specialization: "General Surgery",
        licenseNumber: "MED-2018-089",
        qualifications: ["MBBS", "MS (Surgery)", "FRCS"],
        experience: 12,
        consultationFee: 3500,
        availability: [
          {
            day: "Monday",
            slots: [
              { startTime: "14:00", endTime: "15:00", isBooked: false },
              { startTime: "15:00", endTime: "16:00", isBooked: false },
            ],
          },
          {
            day: "Friday",
            slots: [
              { startTime: "09:00", endTime: "10:00", isBooked: false },
              { startTime: "10:00", endTime: "11:00", isBooked: false },
              { startTime: "11:00", endTime: "12:00", isBooked: false },
            ],
          },
        ],
        rating: 4.6,
      },
    ]);
    console.log("✓ Doctor profiles created");

    // Create Sample Patients
    await User.insertMany([
      {
        name: "Saman Kumara",
        email: "saman@test.com",
        password: "patient123",
        phone: "0771234571",
        role: "patient",
        gender: "male",
        dateOfBirth: new Date("1985-06-15"),
        address: "123, Main Street, Colombo 07",
        status: "active",
      },
      {
        name: "Nethmi Perera",
        email: "nethmi@test.com",
        password: "patient123",
        phone: "0771234572",
        role: "patient",
        gender: "female",
        dateOfBirth: new Date("1992-03-20"),
        address: "456, Galle Road, Dehiwala",
        status: "active",
      },
    ]);
    console.log("✓ Sample patients created");

    console.log("\n========================================");
    console.log("✓ Database seeded successfully!");
    console.log("========================================\n");

    console.log("Test Credentials:");
    console.log("\nAdmin:");
    console.log("  Email: admin@mediflow.com");
    console.log("  Password: admin123");
    console.log("\nDoctor:");
    console.log("  Email: nimal@mediflow.com");
    console.log("  Password: doctor123");
    console.log("\nPatient:");
    console.log("  Email: saman@test.com");
    console.log("  Password: patient123");
    console.log("\n========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
