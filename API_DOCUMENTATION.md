# API Documentation - MediFlow HMS

Complete API reference for MediFlow Hospital Management System.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0771234567",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St, Colombo"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**POST** `/auth/login`

**Body:**

```json
{
  "email": "admin@mediflow.com",
  "password": "admin123"
}
```

**Response:**

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

### 3. Get Current User

**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@mediflow.com",
      "role": "admin",
      "phone": "0771234567"
    }
  }
}
```

---

## Admin Endpoints

**Note:** All admin endpoints require admin role.

### 1. Get All Users

**GET** `/admin/users`

**Query Params:**

- `role` (optional): Filter by role (admin/doctor/patient)
- `status` (optional): Filter by status (active/inactive/suspended)

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": {
    "users": [
      {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "patient",
        "status": "active"
      }
    ]
  }
}
```

### 2. Create Doctor

**POST** `/admin/doctors`

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**

```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@mediflow.com",
  "password": "doctor123",
  "phone": "0771234567",
  "specialization": "Cardiology",
  "licenseNumber": "MED-2023-001",
  "qualifications": ["MBBS", "MD"],
  "experience": 10,
  "consultationFee": 3000
}
```

**Response:**

```json
{
  "success": true,
  "message": "Doctor created successfully",
  "data": {
    "doctor": { ... }
  }
}
```

### 3. Get All Doctors

**GET** `/admin/doctors`

**Headers:** `Authorization: Bearer <admin_token>`

### 4. Update Doctor

**PATCH** `/admin/doctors/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**

```json
{
  "consultationFee": 3500,
  "experience": 11
}
```

### 5. Update User Status

**PATCH** `/admin/users/:id/status`

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**

```json
{
  "status": "inactive"
}
```

### 6. Get Dashboard Stats

**GET** `/admin/dashboard/stats`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalPatients": 150,
    "totalDoctors": 25,
    "activeUsers": 140
  }
}
```

---

## Patient Endpoints

**Note:** All patient endpoints require patient role.

### 1. Get Available Doctors

**GET** `/patient/doctors`

**Query Params:**

- `specialization` (optional): Filter by specialization

**Headers:** `Authorization: Bearer <patient_token>`

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": {
    "doctors": [
      {
        "id": "...",
        "userId": {
          "name": "Dr. John Smith",
          "email": "john@mediflow.com"
        },
        "specialization": "Cardiology",
        "consultationFee": 3000,
        "rating": 4.5
      }
    ]
  }
}
```

### 2. Book Appointment

**POST** `/patient/appointments`

**Headers:** `Authorization: Bearer <patient_token>`

**Body:**

```json
{
  "doctorId": "doctor_id_here",
  "appointmentDate": "2024-03-15",
  "timeSlot": {
    "startTime": "10:00",
    "endTime": "11:00"
  },
  "reason": "Regular checkup",
  "priority": "normal"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "appointment": { ... }
  }
}
```

### 3. Get My Appointments

**GET** `/patient/appointments`

**Headers:** `Authorization: Bearer <patient_token>`

### 4. Cancel Appointment

**PATCH** `/patient/appointments/:id/cancel`

**Headers:** `Authorization: Bearer <patient_token>`

**Body:**

```json
{
  "cancellationReason": "Personal emergency"
}
```

### 5. Get My Medical Records

**GET** `/patient/medical-records`

**Headers:** `Authorization: Bearer <patient_token>`

---

## Doctor Endpoints

**Note:** All doctor endpoints require doctor role.

### 1. Get Doctor Profile

**GET** `/doctor/profile`

**Headers:** `Authorization: Bearer <doctor_token>`

### 2. Update Availability

**PATCH** `/doctor/availability`

**Headers:** `Authorization: Bearer <doctor_token>`

**Body:**

```json
{
  "availability": [
    {
      "day": "Monday",
      "slots": [
        {
          "startTime": "09:00",
          "endTime": "10:00",
          "isBooked": false
        }
      ]
    }
  ]
}
```

### 3. Get My Appointments

**GET** `/doctor/appointments`

**Query Params:**

- `status` (optional): Filter by status
- `date` (optional): Filter by date (YYYY-MM-DD)

**Headers:** `Authorization: Bearer <doctor_token>`

### 4. Update Appointment Status

**PATCH** `/doctor/appointments/:id/status`

**Headers:** `Authorization: Bearer <doctor_token>`

**Body:**

```json
{
  "status": "completed"
}
```

### 5. Create Medical Record

**POST** `/doctor/medical-records`

**Headers:** `Authorization: Bearer <doctor_token>`

**Body:**

```json
{
  "patientId": "patient_id_here",
  "appointmentId": "appointment_id_here",
  "diagnosis": "Hypertension",
  "symptoms": ["High blood pressure", "Headache"],
  "prescription": [
    {
      "medicineName": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take after breakfast"
    }
  ],
  "vitalSigns": {
    "bloodPressure": "140/90",
    "heartRate": "75",
    "temperature": "98.6"
  },
  "notes": "Follow up in 2 weeks"
}
```

### 6. Get Patient Medical History

**GET** `/doctor/patients/:patientId/medical-history`

**Headers:** `Authorization: Bearer <doctor_token>`

---

## Billing Endpoints

### 1. Create Bill (Admin only)

**POST** `/billing`

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**

```json
{
  "patientId": "patient_id_here",
  "appointmentId": "appointment_id_here",
  "items": [
    {
      "description": "Consultation Fee",
      "quantity": 1,
      "unitPrice": 3000,
      "total": 3000
    },
    {
      "description": "Lab Tests",
      "quantity": 2,
      "unitPrice": 1500,
      "total": 3000
    }
  ],
  "subtotal": 6000,
  "tax": 600,
  "discount": 0,
  "paymentMethod": "cash"
}
```

### 2. Get All Bills (Admin only)

**GET** `/billing`

**Query Params:**

- `paymentStatus` (optional): Filter by payment status
- `patientId` (optional): Filter by patient

**Headers:** `Authorization: Bearer <admin_token>`

### 3. Get My Bills (Patient)

**GET** `/billing/my-bills`

**Headers:** `Authorization: Bearer <patient_token>`

### 4. Get Single Bill

**GET** `/billing/:id`

**Headers:** `Authorization: Bearer <token>`

### 5. Update Payment (Admin only)

**PATCH** `/billing/:id/payment`

**Headers:** `Authorization: Bearer <admin_token>`

**Body:**

```json
{
  "paymentStatus": "paid",
  "paidAmount": 6000,
  "paymentMethod": "card",
  "paymentDate": "2024-03-10"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Errors

**Authentication Failed:**

```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

**Validation Error:**

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

**Duplicate Entry:**

```json
{
  "success": false,
  "message": "email already exists"
}
```

---

## Testing with Postman/Thunder Client

1. **Set Base URL:** `http://localhost:5000/api`
2. **Create Environment Variable:** `token`
3. **After login, save token to environment**
4. **Use `{{token}}` in Authorization headers**

---

## Rate Limiting (Future Enhancement)

Currently not implemented. Recommended for production:

- 100 requests per 15 minutes per IP

---

**For more information, see the backend README.md**
