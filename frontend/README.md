# MediFlow HMS - Frontend

React-based frontend application for MediFlow Hospital Management System.

## Features

- **Authentication**: Login and registration with role-based access
- **Admin Dashboard**: Manage doctors, staff, users, and view analytics
- **Doctor Dashboard**: View appointments, manage patient records, add prescriptions
- **Patient Dashboard**: Book appointments, view medical records and bills

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI**: Custom CSS with responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── PrivateRoute.jsx      # Protected route component
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication state management
│   ├── pages/
│   │   ├── admin/
│   │   │   └── Dashboard.jsx     # Admin dashboard & sub-pages
│   │   ├── doctor/
│   │   │   └── Dashboard.jsx     # Doctor dashboard & sub-pages
│   │   ├── patient/
│   │   │   └── Dashboard.jsx     # Patient dashboard & sub-pages
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   └── NotFound.jsx          # 404 page
│   ├── services/
│   │   └── api.js                # API service layer
│   ├── styles/
│   │   ├── Auth.css              # Authentication pages styles
│   │   └── Dashboard.css         # Dashboard pages styles
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Features by Role

### Admin

- View dashboard statistics
- Manage doctors (create, view, update)
- Manage all users
- Update user status (active/inactive/suspended)
- View all appointments
- Manage billing

### Doctor

- View personal profile
- Manage availability schedule
- View assigned appointments
- Update appointment status
- Create medical records and prescriptions
- View patient medical history

### Patient

- Book appointments with doctors
- View appointment history
- Cancel scheduled appointments
- View medical records and prescriptions
- View and track bills

## API Integration

All API calls are configured in `src/services/api.js`:

- **Base URL**: Proxied through Vite to `/api`
- **Authentication**: JWT token stored in localStorage
- **Services**: Separate service objects for auth, admin, patient, doctor, and billing

## Default Test Credentials

After seeding the database, you can use:

```
Admin:
Email: admin@mediflow.com
Password: admin123

Doctor:
Email: doctor@mediflow.com
Password: doctor123

Patient:
Email: patient@mediflow.com
Password: patient123
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel / Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist/` folder

3. Configure environment variables:
   - Set API base URL if different from `/api`

### Important Notes

- Ensure backend API is accessible from production frontend
- Update CORS settings in backend to allow frontend domain
- Configure proper proxy or API URL for production

## License

MIT
