# Quick Start - MediFlow HMS

Get up and running in 5 minutes!

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

## Setup Commands

### Backend

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGO_URI=mongodb://127.0.0.1:27017/mediflow_hms
# JWT_SECRET=your_secret_key

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend runs on: **http://localhost:5000**

### Frontend

Open a new terminal:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend runs on: **http://localhost:3000**

## Test Credentials

**Admin:**

- Email: `admin@mediflow.com`
- Password: `admin123`

**Doctor:**

- Email: `nimal@mediflow.com`
- Password: `doctor123`

**Patient:**

- Email: `saman@test.com`
- Password: `patient123`

## Test API

Visit: http://localhost:5000/api/health

## Test Frontend

Visit: http://localhost:3000

## Troubleshooting

**MongoDB not running?**

```powershell
mongod
```

**Port already in use?**

```powershell
# Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

**Need to reset database?**

```powershell
cd backend
npm run seed
```

## What's Next?

1. Login with test credentials
2. Explore different user roles:
   - **Admin**: Manage doctors and users
   - **Doctor**: View appointments, add prescriptions
   - **Patient**: Book appointments, view records
3. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
4. Read [README.md](README.md) for full documentation

---

**Need help?** Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.
