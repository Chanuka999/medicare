import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.model.js";
import Doctor from "./src/models/Doctor.model.js";
import MedicalRecord from "./src/models/MedicalRecord.model.js";
import Review from "./src/models/Review.model.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data (optional - comment out to keep existing data)
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Review.deleteMany({});
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

    const patients = await User.insertMany([
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

    // Create Sample Medical Records (with linked doctors from Doctor collection)
    const doctors = await Doctor.find();
    await MedicalRecord.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        diagnosis: "Hypertension - Controlled",
        symptoms: ["High blood pressure", "Occasional headaches"],
        prescription: [
          {
            medicineName: "Amlodipine",
            dosage: "5mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take in the morning with food",
          },
          {
            medicineName: "Aspirin",
            dosage: "75mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take after dinner",
          },
        ],
        vitalSigns: {
          bloodPressure: "140/90",
          heartRate: "78 bpm",
          temperature: "98.6°F",
          weight: "75 kg",
        },
        notes:
          "Patient advised to monitor blood pressure daily and maintain low-salt diet. Follow-up in 1 month.",
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        diagnosis: "Common Cold",
        symptoms: ["Runny nose", "Sore throat", "Mild fever"],
        prescription: [
          {
            medicineName: "Paracetamol",
            dosage: "500mg",
            frequency: "3 times daily",
            duration: "5 days",
            instructions: "Take after meals",
          },
          {
            medicineName: "Cetirizine",
            dosage: "10mg",
            frequency: "Once daily at night",
            duration: "5 days",
            instructions: "Take before sleep",
          },
        ],
        vitalSigns: {
          temperature: "99.5°F",
          heartRate: "82 bpm",
        },
        notes:
          "Advised rest and increased fluid intake. Return if symptoms persist beyond 5 days.",
      },
      {
        patientId: patients[0]._id,
        doctorId: doctors[2]._id,
        diagnosis: "Annual Health Checkup - Normal",
        symptoms: [],
        prescription: [
          {
            medicineName: "Vitamin D3",
            dosage: "1000 IU",
            frequency: "Once daily",
            duration: "90 days",
            instructions: "Take with breakfast",
          },
        ],
        vitalSigns: {
          bloodPressure: "120/80",
          heartRate: "72 bpm",
          temperature: "98.4°F",
          weight: "74 kg",
          height: "170 cm",
        },
        notes:
          "All vital parameters normal. Continue healthy lifestyle. Next checkup in 12 months.",
        followUpDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log("✓ Sample medical records created");

    // Create Sample Reviews
    await Review.insertMany([
      {
        doctorId: doctors[0].userId,
        patientId: patients[0]._id,
        rating: 5,
        comment:
          "Dr. Nimal is an excellent cardiologist. Very thorough in examination and explains everything clearly. Highly recommend!",
      },
      {
        doctorId: doctors[0].userId,
        patientId: patients[1]._id,
        rating: 4,
        comment:
          "Good doctor with lots of experience. Wait time was a bit long but the consultation was worth it.",
      },
      {
        doctorId: doctors[1].userId,
        patientId: patients[0]._id,
        rating: 5,
        comment:
          "Dr. Kamani is wonderful with children. My daughter felt very comfortable during the visit. Excellent pediatrician!",
      },
      {
        doctorId: doctors[2].userId,
        patientId: patients[1]._id,
        rating: 5,
        comment:
          "Very professional and skilled surgeon. Took time to explain the procedure and answered all my questions. Highly satisfied!",
      },
    ]);
    console.log("✓ Sample reviews created");

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
