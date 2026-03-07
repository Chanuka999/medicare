# MediFlow HMS - Backend API

RESTful API for MediFlow Hospital Management System built with Node.js, Express, and MongoDB.

## Features

- JWT authentication & authorization
- Role-based access control (Admin, Doctor, Patient)
- Patient registration and profile management
- Doctor management and availability scheduling
- Appointment booking and management
- Medical records and prescription management
- Billing and invoice generation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Update environment variables in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mediflow_hms
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRES_IN=1d
```

4. Start development server:

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Admin Routes (Admin only)

- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Update user status
- `POST /api/admin/doctors` - Create doctor
- `GET /api/admin/doctors` - Get all doctors
- `PATCH /api/admin/doctors/:id` - Update doctor
- `GET /api/admin/dashboard/stats` - Dashboard statistics

### Patient Routes (Patient only)

- `GET /api/patient/doctors` - Get available doctors
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get my appointments
- `PATCH /api/patient/appointments/:id/cancel` - Cancel appointment
- `GET /api/patient/medical-records` - Get my medical records

### Doctor Routes (Doctor only)

- `GET /api/doctor/profile` - Get doctor profile
- `PATCH /api/doctor/availability` - Update availability
- `GET /api/doctor/appointments` - Get doctor appointments
- `PATCH /api/doctor/appointments/:id/status` - Update appointment status
- `POST /api/doctor/medical-records` - Create medical record/prescription
- `GET /api/doctor/patients/:patientId/medical-history` - Get patient history

### Billing Routes

- `POST /api/billing` - Create bill (admin)
- `GET /api/billing` - Get all bills (admin)
- `GET /api/billing/my-bills` - Get my bills (patient)
- `GET /api/billing/:id` - Get single bill
- `PATCH /api/billing/:id/payment` - Update payment (admin)

## Database Models

- **User**: name, email, password, role, phone, address, dateOfBirth, gender, status
- **Doctor**: userId, specialization, licenseNumber, qualifications, experience, consultationFee, availability, rating
- **Appointment**: patientId, doctorId, appointmentDate, timeSlot, status, reason, priority
- **MedicalRecord**: patientId, doctorId, diagnosis, symptoms, prescription, labTests, vitalSigns, notes
- **Bill**: invoiceNumber, patientId, items, totalAmount, paymentStatus, paymentMethod

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── patient.controller.js
│   │   ├── doctor.controller.js
│   │   └── billing.controller.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── models/                # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Doctor.model.js
│   │   ├── Appointment.model.js
│   │   ├── MedicalRecord.model.js
│   │   └── Bill.model.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── patient.routes.js
│   │   ├── doctor.routes.js
│   │   └── billing.routes.js
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env.example               # Environment variables template
├── .gitignore
└── package.json
```

## Development

```bash
# Start dev server with auto-reload
npm run dev

# Start production server
npm start
```

## Testing

Test API endpoints using [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/).

### Sample Login Request

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@mediflow.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@mediflow.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Use the token in subsequent requests:

```
Authorization: Bearer <token>
```

## License

MIT
