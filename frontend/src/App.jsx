import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import PatientDashboard from "./pages/patient/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              <PrivateRoute role="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/patient/*"
            element={
              <PrivateRoute role="patient">
                <PatientDashboard />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
