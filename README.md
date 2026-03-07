# MediFlow HMS - Hospital Management System

A comprehensive, role-based Hospital Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). The system streamlines hospital operations with secure dashboards for Admins, Doctors, and Patients.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🏥 Project Overview

**MediFlow HMS** simplifies hospital administration by providing:
- **Patient Registration** and profile management
- **Appointment Booking** with doctor selection
- **Prescription Management** by doctors
- **Billing & Invoicing** for appointments and services
- **Role-Based Access Control** for Admin, Doctor, and Patient

## ✨ Core Features

### Admin Features
- Dashboard with key statistics (patients, doctors, users)
- Manage doctors and staff accounts
- Update user status (active/inactive/suspended)
- View all appointments and billing records
- Generate reports and analytics

### Doctor Features
- Personal profile and availability management
- View assigned appointments (today, upcoming, history)
- Update appointment status (scheduled → completed)
- Create medical records with prescriptions
- Access patient medical history
- Add lab test results and vital signs

### Patient Features
- Book appointments with preferred doctors
- View appointment history
- Cancel scheduled appointments (with reason)
- Access medical records and prescriptions
- View and track billing/invoices

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 with Hooks
- React Router v6 for navigation
- Axios for API calls
- Context API for state management
- Custom CSS with responsive design

## 📁 Project Structure

```
medicare/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── app.js           # Express app
│   │   └── server.js        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin dashboard
│   │   │   ├── doctor/      # Doctor dashboard
│   │   │   └── patient/     # Patient dashboard
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd medicare
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mediflow_hms
JWT_SECRET=your_secure_secret_key_change_this
JWT_EXPIRES_IN=1d
```

Start backend server:
```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 🗄️ Database Setup

Make sure MongoDB is running:

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and update `MONGO_URI` in backend `.env`

## 📊 Database Schema

### Collections

**Users**
- name, email, password (hashed), role, phone, address, dateOfBirth, gender, status

**Doctors**
- userId (ref: User), specialization, licenseNumber, qualifications, experience, consultationFee, availability, rating

**Appointments**
- patientId (ref: User), doctorId (ref: Doctor), appointmentDate, timeSlot, status, reason, priority

**Medical_Records**
- patientId, doctorId, diagnosis, symptoms, prescription[], labTests[], vitalSigns, notes

**Bills**
- invoiceNumber, patientId, appointmentId, items[], totalAmount, paymentStatus, paymentMethod

## 🔐 Authentication & Authorization

- **JWT-based authentication** with Bearer token
- **Role-based access control (RBAC)** middleware
- **Protected routes** on both backend and frontend
- **Password hashing** with bcryptjs

### Default Roles
- `admin` - Full system access
- `doctor` - Appointment and medical records management
- `patient` - Book appointments, view records

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/doctors` - Create doctor
- `GET /api/admin/doctors` - Get all doctors
- `PATCH /api/admin/users/:id/status` - Update user status

### Patient (Patient only)
- `GET /api/patient/doctors` - Get available doctors
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get my appointments
- `PATCH /api/patient/appointments/:id/cancel` - Cancel appointment

### Doctor (Doctor only)
- `GET /api/doctor/appointments` - Get doctor appointments
- `POST /api/doctor/medical-records` - Create medical record
- `PATCH /api/doctor/appointments/:id/status` - Update appointment status

### Billing
- `POST /api/billing` - Create bill (admin)
- `GET /api/billing/my-bills` - Get patient bills (patient)
- `GET /api/billing/:id` - Get single bill

Full API documentation in [`backend/README.md`](backend/README.md)

## 🎨 Extra Features (Enhancements)

### Implemented
- Priority flag for emergency appointments
- Medical history timeline
- Invoice generation with unique invoice numbers
- User status management (active/inactive/suspended)

### Future Enhancements
- 📧 Email/SMS notifications for appointments
- 📅 Google Calendar integration
- 📄 E-prescription PDF generation
- 💳 Online payment gateway integration
- 📊 Advanced analytics dashboard
- 🌐 Multi-language support (Sinhala/English)
- 📱 Mobile app version
- 🔔 Real-time notifications (Socket.io)

## 🧪 Testing

### Backend API Testing

Use **Postman** or **Thunder Client**:

1. Register a user:
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Test Patient",
  "email": "patient@test.com",
  "password": "password123",
  "phone": "0771234567",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

2. Login:
```json
POST http://localhost:5000/api/auth/login
{
  "email": "patient@test.com",
  "password": "password123"
}
```

3. Use returned token in Authorization header:
```
Authorization: Bearer <your-token>
```

## 🚀 Deployment

### Backend (Render / Railway)

1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel / Netlify)

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Deploy `dist/` folder to Vercel/Netlify
3. Update API URL if needed

### MongoDB Atlas

- Use MongoDB Atlas for production database
- Update `MONGO_URI` with Atlas connection string

## 📝 Development Workflow

### Week 1: Foundation
- Project setup (backend + frontend)
- Authentication & RBAC
- Database models

### Week 2: Core Features
- Patient registration
- Doctor management (admin)
- Basic dashboards

### Week 3: Appointments
- Appointment booking (patient)
- Appointment management (doctor)
- Calendar integration

### Week 4: Medical Records
- Prescription management
- Medical history
- Lab reports

### Week 5: Billing
- Invoice generation
- Payment tracking
- Bill management

### Week 6: Polish & Deploy
- Testing
- Bug fixes
- Documentation
- Deployment

## 📄 License

MIT License - feel free to use this project for learning or building your own HMS.

## 👨‍💻 Author

Built with ❤️ for hospital workflow optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
