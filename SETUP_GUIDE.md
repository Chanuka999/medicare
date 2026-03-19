# MediFlow HMS - Complete Setup Guide

This guide will walk you through setting up the MediFlow Hospital Management System from scratch.

## Prerequisites Checklist

Before you begin, ensure you have the following installed:

- [ ] **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- [ ] **MongoDB** (local installation or Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- [ ] **Git** - [Download](https://git-scm.com/)
- [ ] **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd medicare
```

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

Expected output: All dependencies installed successfully.

### 2.2 Setup Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mediflow_hms
JWT_SECRET=your_very_secure_secret_key_change_this_in_production
JWT_EXPIRES_IN=1d
```

**Important Notes:**

- Change `JWT_SECRET` to a secure random string in production
- For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string
- Default local MongoDB URI: `mongodb://127.0.0.1:27017/mediflow_hms`

### 2.3 Start MongoDB

**Option A: Local MongoDB**

```bash
mongod
```

**Option B: MongoDB Atlas**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### 2.4 Seed the Database

Populate database with initial data (admin, doctors, patients):

```bash
npm run seed
```

Expected output:

```
✓ Admin user created
✓ Doctor users created
✓ Doctor profiles created
✓ Sample patients created
✓ Database seeded successfully!
```

### 2.5 Start Backend Server

```bash
npm run dev
```

Expected output:

```
Server running on port 5000
MongoDB connected
```

**Backend is now running at:** `http://localhost:5000`

### 2.6 Test Backend API

Test the health endpoint:

**PowerShell:**

```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health
```

**Browser:**
Open `http://localhost:5000/api/health`

Expected response:

```json
{
  "message": "MediFlow HMS API running"
}
```

## Step 3: Frontend Setup

Open a **new terminal** window (keep backend running).

### 3.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

Expected output: All dependencies installed successfully.

### 3.2 Start Frontend Server

```bash
npm run dev
```

Expected output:

```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

**Frontend is now running at:** `http://localhost:3000`

### 3.3 Access the Application

Open your browser and go to: `http://localhost:3000`

You should see the MediFlow HMS login page.

## Step 4: Test the Application

### 4.1 Test Login Credentials

Use the following credentials to test different user roles:

**Admin User:**

- Email: `admin@mediflow.com`
- Password: `admin123`
- Access: Full system control

**Doctor User:**

- Email: `nimal@mediflow.com`
- Password: `doctor123`
- Access: Appointments, medical records

**Patient User:**

- Email: `saman@test.com`
- Password: `patient123`
- Access: Book appointments, view records

### 4.2 Test User Flows

**As Admin:**

1. Login with admin credentials
2. Navigate to "Manage Doctors"
3. Try adding a new doctor
4. View dashboard statistics

**As Doctor:**

1. Login with doctor credentials
2. View today's appointments
3. Check appointment list
4. View profile information

**As Patient:**

1. Login with patient credentials
2. Browse available doctors
3. Book an appointment
4. View appointment history

## Step 5: Development Workflow

### Running Both Servers

You need **two terminal windows**:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Making Changes

**Backend Changes:**

- Edit files in `backend/src/`
- Server auto-restarts (nodemon)
- Check terminal for errors

**Frontend Changes:**

- Edit files in `frontend/src/`
- Browser auto-reloads (Vite HMR)
- Check browser console for errors

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**

1. Check if MongoDB is running:
   ```bash
   mongod
   ```
2. Verify `MONGO_URI` in `.env`
3. Check MongoDB port (default: 27017)

### Issue: "Port 5000 already in use"

**Solution:**

1. Find and kill process using port 5000:
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
   ```
2. Or change `PORT` in `.env`

### Issue: "Frontend can't connect to backend"

**Solution:**

1. Ensure backend is running on port 5000
2. Check proxy configuration in `frontend/vite.config.js`
3. Check browser console for CORS errors

### Issue: "Module not found"

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: "JWT token invalid"

**Solution:**

1. Logout and login again
2. Clear browser localStorage
3. Check `JWT_SECRET` matches in `.env`

## Database Management

### Reset Database

To clear all data and reseed:

```bash
cd backend
npm run seed
```

### View Database

**Option 1: MongoDB Compass** (GUI)

- Download: [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect to: `mongodb://127.0.0.1:27017`
- Database: `mediflow_hms`

**Option 2: Mongo Shell**

```bash
mongosh
use mediflow_hms
show collections
db.users.find()
```

## API Testing

### Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Import requests from `backend/README.md`
3. Test endpoints

### Using Postman

1. Download [Postman](https://www.postman.com/)
2. Create new collection "MediFlow HMS"
3. Add requests from API documentation

**Example Request:**

**Login:**

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@mediflow.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Copy the token and use it in protected requests:

```
Authorization: Bearer <your-token>
```

## Production Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [Render](https://render.com/)
3. Create new Web Service
4. Connect GitHub repository
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables from `.env`
8. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import repository
4. Set root directory: `frontend`
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy

### MongoDB Atlas Setup

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (or allow all: 0.0.0.0/0)
4. Get connection string
5. Update `MONGO_URI` in production environment

## Next Steps

### Recommended Learning Path

1. **Understand the Architecture**
   - Review `README.md` for project overview
   - Study database models in `backend/src/models/`
   - Review API routes in `backend/src/routes/`

2. **Explore the Code**
   - Backend controllers for business logic
   - Frontend pages for UI components
   - Authentication flow (JWT)

3. **Add New Features**
   - Implement extra features from roadmap
   - Add email notifications
   - Integrate payment gateway
   - Generate PDF reports

4. **Improve the UI**
   - Enhance CSS styling
   - Add animations
   - Improve mobile responsiveness
   - Add loading states

### Useful Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [JWT Introduction](https://jwt.io/introduction)

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review error messages in terminal/console
3. Check `backend/README.md` and `frontend/README.md`
4. Create an issue in the repository

## Success Checklist

- [ ] MongoDB running and connected
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Can access login page at http://localhost:3000
- [ ] Can login with test credentials
- [ ] Can navigate between dashboards
- [ ] API endpoints responding correctly

**Congratulations! You've successfully set up MediFlow HMS! 🎉**

---

Happy Coding! If you found this helpful, please star the repository! ⭐
