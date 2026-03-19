# Deploy MediFlow HMS to Vercel (Backend + Frontend)

## Overview

Deploy your complete MERN application to Vercel in 30 minutes:

- **Frontend**: React app (Vite) → Vercel
- **Backend**: Node.js/Express API Routes → Vercel Serverless Functions
- **Database**: MongoDB Atlas (Free Cloud)

## Architecture

```
Frontend + Backend (Both on Vercel)
├── Frontend: React + Vite → Example: https://mediflow.vercel.app
├── Backend: API Routes → Example: https://mediflow.vercel.app/api
└── Database: MongoDB Atlas (Cloud Hosted)
```

## Prerequisites

1. GitHub account (https://github.com)
2. Vercel account (sign up at https://vercel.com - use GitHub)
3. MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

---

## STEP 1: Set Up MongoDB Atlas (Free Database)

### 1.1 Create MongoDB Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up Free"**
3. Sign up with email or GitHub
4. Create account

### 1.2 Create Free Cluster

1. Click **"Create"** → **"Build a Database"**
2. Choose **"Free"** tier (M0 - 0.5GB storage)
3. Choose cloud provider: **AWS**
4. Choose region: **Singapore** (or closest to you)
5. Click **"Create Cluster"** (waits 1-2 minutes)

### 1.3 Create Database User

1. Go to **"Database Access"** (left menu)
2. Click **"Add New Database User"**
3. Choose: **"Password"** authentication
4. **Username**: `admin`
5. **Password**: Create strong password (copy and save it!)
6. **Database User Privileges**: Select **"Atlas Admin"**
7. Click **"Add User"**

### 1.4 Allow Network Access

1. Go to **"Network Access"** (left menu)
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **"Clusters"** → Click **"Connect"**
2. Choose **"Drivers"** → **"Node.js"**
3. Click **"Copy"** connection string
4. It looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. **Replace `<password>` with the password you created** (remove angle brackets)

**Example**: `mongodb+srv://admin:MyPassword123@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

---

## STEP 2: Prepare Project Structure for Vercel

### 2.1 Update Backend for Vercel Serverless

Go to `backend/src/app.js` and make sure exports are ready:

```javascript
// At the end of app.js (around line 30-35)
export default app;
```

### 2.2 Create Vercel Backend Configuration

Create file: **`backend/vercel.json`**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2.3 Create Frontend Vercel Configuration

Create file: **`frontend/vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### 2.4 Update `backend/package.json`

Ensure you have a start script:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

### 2.5 Create `.env.example` Files (No Secrets!)

**`backend/.env.example`**:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://admin:password@cluster.mongodb.net/mediflow?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_min_32_characters
```

**`frontend/.env.example`**:

```
VITE_API_URL=/api
```

### 2.6 Update Frontend API Configuration

**`frontend/src/services/api.js`**:

```javascript
import axios from "axios";

// Use environment variable or default to /api for same-origin requests
const API_URL = import.meta.env.VITE_API_URL || "/api";

const isValidJwtToken = (token) => {
  if (!token || token === "undefined" || token === "null") return false;
  return token.split(".").length === 3;
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ... rest of code
```

### 2.7 Update Backend CORS

**`backend/src/app.js`**:

```javascript
import cors from "cors";

// Allow requests from same origin (Vercel URL)
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

---

## STEP 3: Push Project to GitHub

### 3.1 Initialize Git Repository

Open PowerShell in project root (`f:\Mern_stack_project\medicare`):

```powershell
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

### 3.2 Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `mediflow-hms` (or your choice)
3. **Description**: `Hospital Management System`
4. Choose **Public** (free public repo)
5. Click **"Create repository"**

### 3.3 Push Code to GitHub

In PowerShell:

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mediflow-hms.git

# Rename branch to main if needed
git branch -M main

# Push code
git push -u origin main
```

---

## STEP 4: Deploy to Vercel

### 4.1 Create Vercel Project (Frontend)

1. Go to https://vercel.com
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Find and select **`mediflow-hms`** repository
5. Click **"Import"**

### 4.2 Configure Frontend Build

Vercel should auto-detect, but verify:

- **Framework**: Vite
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Click **"Deploy"** - wait 2-3 minutes ✅

After deployment, you'll get URL like: **`https://mediflow-hms.vercel.app`**

### 4.3 Create Vercel Project (Backend)

1. Click **"New Project"** on Vercel
2. Select same `mediflow-hms` GitHub repository
3. **Change Root Directory to**: `backend`
4. Click **"Environment Variables"**
5. Add these variables:

| Key          | Value                                             |
| ------------ | ------------------------------------------------- |
| `MONGO_URI`  | Your MongoDB connection string (with password!)   |
| `JWT_SECRET` | Use a strong 32+ character secret (generate one!) |
| `NODE_ENV`   | `production`                                      |

6. Click **"Deploy"** - wait 2-3 minutes ✅

After deployment, you'll get URL like: **`https://mediflow-backend.vercel.app`**

### 4.4 Connect Frontend & Backend

Now update frontend to use the backend URL:

1. Go to frontend project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://mediflow-backend.vercel.app/api`
4. Click **"Save"**
5. Click **"Deployments"** → **"Redeploy"** the latest build

---

## STEP 5: Test Your Application

### 5.1 Test Frontend

1. Go to `https://mediflow-hms.vercel.app`
2. Should see login page ✅

### 5.2 Test Backend API

Open a new browser tab and test:

```
https://mediflow-backend.vercel.app/api/health
```

Should return: `{"message":"MediFlow HMS API running"}`

### 5.3 Test Login

1. Go to frontend URL
2. Try to login with email: `admin@mediflow.com` password: `admin123`
3. Should load dashboard with stats ✅

### 5.4 Check Browser Console

Open DevTools (F12):

1. Go to **Network** tab
2. Try to login
3. Should see requests to backend with status **200** ✅
4. No CORS errors

---

## STEP 6: Fix Issues (If Any)

### Issue: CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: Update `backend/src/app.js`:

```javascript
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
```

Then redeploy backend.

### Issue: Can't Connect to Database

```
MongooseError: Cannot connect
```

**Causes**:

1. Wrong password in MONGO_URI
2. IP not whitelisted in MongoDB
3. Database name incorrect

**Fix**:

1. Verify password (no special chars issues)
2. In MongoDB Atlas → Network Access → make sure IP whitelist is set
3. Test connection string locally first

### Issue: 404 API Errors

```
GET https://mediflow-backend.vercel.app/api/auth/login 404
```

**Solution**:

1. Check backend deployment succeeded
2. Verify VITE_API_URL environment variable is set
3. Redeploy frontend after setting env var

### Issue: Cold Start Delay

First request takes 10-20 seconds on free Vercel - this is normal.

---

## Quick Reference: Project Structure

After setup, your GitHub should have:

```
mediflow-hms/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── middleware/
│   ├── package.json
│   ├── vercel.json  ← NEW
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   ├── vercel.json  ← NEW
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured
- [ ] Connection string copied (with password)
- [ ] `backend/vercel.json` created
- [ ] `frontend/vercel.json` created
- [ ] `backend/src/app.js` exports app
- [ ] `.env.example` files created (no secrets!)
- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Vercel
- [ ] Environment variables set in Vercel for both projects
- [ ] Frontend VITE_API_URL points to backend
- [ ] Login page loads
- [ ] API health check works
- [ ] Can login to dashboard
- [ ] Charts and data load
- [ ] No console errors

---

## Environment Variables Summary

### Backend on Vercel

Set in Vercel Dashboard → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/mediflow?retryWrites=true&w=majority
JWT_SECRET=your_32_plus_character_secret_key_here
NODE_ENV=production
```

### Frontend on Vercel

Set in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://mediflow-backend.vercel.app/api
```

---

## Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/node-js)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)

---

## Summary

✅ **Frontend**: Deployed to Vercel with React  
✅ **Backend**: Deployed to Vercel as serverless functions  
✅ **Database**: MongoDB Atlas (free 512MB)  
✅ **Total Cost**: FREE (unless you exceed quotas)  
✅ **Time to Deploy**: 30 minutes

**Your app is now live!** 🎉

### 1.3 Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin` (or desired username)
5. Password: Create a strong password (copy and save it!)
6. Database User Privileges: "Atlas Admin"
7. Click "Add User"

### 1.4 Whitelist IP Address

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add specific IPs)
4. Click "Confirm"

### 1.5 Get Connection String

1. Go to "Clusters" → Click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
5. Replace `username`, `password`, and `database` with your info

## Step 2: Deploy Backend

### Option A: Deploy to Render (Recommended - Free Tier Available)

#### 2A.1 Prepare Backend for Production

1. Update `backend/.env`:

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mediflow?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
```

2. Ensure `backend/package.json` has `"start": "node src/server.js"`:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

3. Verify `.gitignore` includes:

```
node_modules
.env
.env.local
```

#### 2A.2 Push to GitHub

1. Initialize git (if not done):

```bash
cd f:\Mern_stack_project\medicare
git init
git add .
git commit -m "Initial commit"
```

2. Create GitHub repository
3. Push code:

```bash
git remote add origin https://github.com/username/mediflow.git
git push -u origin main
```

#### 2A.3 Deploy to Render

1. Go to: https://render.com
2. Click "Sign up" (GitHub account recommended)
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Select `mediflow` repository
6. Configure service:
   - **Name**: `mediflow-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
7. Add environment variables:
   - Click "Advanced"
   - Add:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `NODE_ENV`: `production`
8. Click "Create Web Service"
9. Wait for deployment (2-5 minutes)
10. Copy the service URL (e.g., `https://mediflow-backend.onrender.com`)

### Option B: Deploy to Railway

#### 2B.1 Connect GitHub

1. Go to: https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway
4. Click "New Project"
5. Select "Deploy from GitHub repo"
6. Connect your GitHub account and select `mediflow` repo

#### 2B.2 Configure Service

1. Click "Add Service" → "GitHub repo" → select `mediflow`
2. Configure:
   - **Start Command**: `cd backend && npm start`
   - **Build Command**: `cd backend && npm install`
3. Add variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `NODE_ENV`: `production`
4. Click "Deploy"
5. Copy the deployment URL

### Option C: Deploy to Heroku (Paid - Discontinued Free Tier)

1. Go to: https://www.heroku.com
2. Create account and app
3. Connect GitHub repository
4. Set buildpacks:
   ```bash
   heroku buildpacks:add -a app-name heroku/nodejs
   ```
5. Add config vars (environment variables)
6. Enable automatic deploys

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend

1. Update API base URL in `frontend/src/services/api.js`:

```javascript
// Change from:
const API_URL = "/api";

// To (using environment variable):
const API_URL = process.env.REACT_APP_API_URL || "/api";
```

2. Create `frontend/.env.production`:

```
VITE_API_URL=https://mediflow-backend.onrender.com/api
```

3. Update vite.config.js:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
```

4. In `frontend/src/services/api.js`, update:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "/api";
```

### 3.2 Deploy to Vercel

#### Method 1: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login:

```bash
vercel login
```

3. Deploy from frontend directory:

```bash
cd frontend
vercel --prod
```

4. Follow prompts:
   - Link to existing project? No (create new)
   - Select scope
   - Project name: `mediflow`
   - Framework: Vite
   - Root directory: `./`
   - Confirm build settings
5. Add environment variables in Vercel dashboard:
   - Go to project → Settings → Environment Variables
   - Add: `VITE_API_URL=https://mediflow-backend.onrender.com/api`

#### Method 2: Using Git (Recommended)

1. Push frontend folder structure to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push
```

2. Go to: https://vercel.com
3. Click "New Project"
4. Select GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Environment Variables"
7. Add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
8. Click "Deploy"
9. Wait for deployment (1-3 minutes)
10. Your frontend is live! Copy the Vercel URL

## Step 4: Update CORS Settings

### Update Backend CORS Configuration

In `backend/src/app.js`:

```javascript
import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local dev
      "http://localhost:5173", // Vite dev
      "https://your-vercel-frontend.vercel.app", // Vercel frontend
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
```

Or set dynamically from environment:

```javascript
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:3000"
).split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
```

Add to `.env`:

```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://your-vercel-frontend.vercel.app
```

## Step 5: Verification

### Test Deployed Application

1. Go to your Vercel frontend URL
2. Try to login/register
3. Check Network tab in DevTools:
   - Requests should go to backend URL
   - No CORS errors
4. Test all major features:
   - Authentication
   - Dashboard stats loading
   - Charts rendering
   - Notifications
   - Appointments booking

### Troubleshooting Issues

#### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: Update CORS origins in backend

#### 404 API Errors

```
POST https://your-backend.onrender.com/api/auth/login 404
```

**Causes**:

- Backend not deployed correctly
- API_URL incorrect in frontend
- Backend service down
- Route not registered

**Check**:

```bash
curl https://your-backend.onrender.com/api/health
```

#### Database Connection Errors

```
MongooseError: Cannot connect to database
```

**Causes**:

- MONGO_URI incorrect
- MongoDB Atlas whitelist missing
- Database user credentials wrong

**Solutions**:

1. Verify connection string: `mongodb+srv://user:password@cluster.mongodb.net/db?...`
2. Add backend IP to MongoDB whitelist
3. Check database user credentials

#### Cold Start Delays

On free tiers, services sleep. First request takes 20-30 seconds.

- Use paid tier for production
- Implement heartbeat/ping service

## Deployment Checklist

### Backend

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (or allow all)
- [ ] Connection string copied
- [ ] `.env` file configured with MONGO_URI and JWT_SECRET
- [ ] `package.json` has `start` script
- [ ] `.gitignore` excludes `.env` and `node_modules`
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render/Railway
- [ ] Backend URL obtained (e.g., https://mediflow-backend.onrender.com)
- [ ] `/api/health` endpoint returns 200

### Frontend

- [ ] `api.js` uses environment variables for API_URL
- [ ] `.env.production` created with VITE_API_URL
- [ ] `backend/src/app.js` CORS configured with frontend URL
- [ ] Frontend pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variable VITE_API_URL added in Vercel
- [ ] Frontend deployed and URL obtained
- [ ] Test login and API calls work

## Important Security Notes

### Secrets Management

✅ Store secrets in environment variables, NOT in code
✅ Use `.env.local` for local development
✅ Add `.env` to `.gitignore`
✅ Use platform-specific secret management (Render, Vercel)

### API Security

✅ JWT tokens stored in httpOnly cookies (not localStorage)
✅ CORS properly configured
✅ Input validation on both frontend and backend
✅ Rate limiting on API endpoints
✅ HTTPS enforced (automatic with Vercel/Render)

### Database Security

✅ MongoDB user with minimal required permissions
✅ IP whitelist configured
✅ Regular backups enabled (MongoDB Atlas)
✅ Connection string never committed to git

## Production Optimization

### Backend

1. Enable compression:

```javascript
import compression from "compression";
app.use(compression());
```

2. Add error logging:

```javascript
// Sentry, LogRocket, or similar
```

3. Database indexing:

```javascript
// Ensure indexes on frequently queried fields
```

### Frontend

1. Vite build optimization:

```javascript
// Already optimized by default
```

2. Code splitting:

```javascript
// React.lazy() for route-based splitting
```

3. Image optimization:
   - Use WebP format
   - Lazy load images
   - Use CDN

## Scaling for Production

### When Your App Grows:

1. **Database**:
   - Upgrade MongoDB Atlas tier
   - Enable auto-scaling
   - Set up sharding if needed

2. **Backend**:
   - Switch to paid tier on Render/Railway
   - Implement caching (Redis)
   - Use CDN for static assets

3. **Frontend**:
   - Use Vercel Analytics
   - Enable automatic deployments
   - Set up performance monitoring

## Cost Estimates (Monthly)

| Service         | Free Tier    | Pro Tier | Notes                      |
| --------------- | ------------ | -------- | -------------------------- |
| MongoDB Atlas   | Free (1GB)   | $9+      | 10GB recommended start     |
| Render Backend  | $7 (limited) | $12+     | Free tier needs 15min ping |
| Vercel Frontend | Free         | $20+     | Unlimited deployments      |
| **Total**       | **~$7**      | **$41+** | Scales with usage          |

## Useful Commands

```bash
# Test backend locally before deploying
cd backend
npm run dev

# Build and test frontend
cd frontend
npm run build
npm run preview

# Check if backend is reachable
curl https://your-backend.onrender.com/api/health

# View backend logs
vercel logs mediflow-backend

# List deployed versions
vercel list
```

## Helpful Docs

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vite Deployment](https://vitejs.dev/guide/ssr.html)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Next Steps

1. Set up MongoDB Atlas ✅
2. Deploy backend to Render/Railway ✅
3. Configure frontend environment variables ✅
4. Deploy frontend to Vercel ✅
5. Test all features work ✅
6. Set up monitoring/logging
7. Configure domain name (optional)
8. Set up CI/CD for automatic deployments
9. Enable backups
10. Monitor costs and performance

## Support

If you encounter issues:

1. Check server logs (Render, Vercel dashboards)
2. Test API directly with curl/Postman
3. Check browser DevTools Network tab
4. Review CORS settings
5. Verify all environment variables set
6. Check authentication tokens
7. Look at MongoDB connection logs
