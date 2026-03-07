import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doctorService } from "../../services/api";
import "../../styles/Dashboard.css";

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await doctorService.getProfile();
      setProfile(response.data.data.doctor);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>MediFlow HMS</h2>
          <p className="user-badge">Doctor</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/doctor" className="nav-link">
            Dashboard
          </Link>
          <Link to="/doctor/appointments" className="nav-link">
            My Appointments
          </Link>
          <Link to="/doctor/patients" className="nav-link">
            Patient Records
          </Link>
          <Link to="/doctor/profile" className="nav-link">
            My Profile
          </Link>
        </nav>
        <div className="sidebar-footer">
          <p>{user?.name}</p>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomeOverview profile={profile} />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route
            path="/patients"
            element={<div>Patient Records (Coming Soon)</div>}
          />
          <Route path="/profile" element={<ProfileView profile={profile} />} />
        </Routes>
      </main>
    </div>
  );
};

const HomeOverview = ({ profile }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadTodayAppointments();
  }, []);

  const loadTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await doctorService.getMyAppointments({ date: today });
      setAppointments(response.data.data.appointments);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Appointments</h3>
          <p className="stat-number">{appointments.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p className="stat-number">{profile?.totalPatients || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Rating</h3>
          <p className="stat-number">{profile?.rating?.toFixed(1) || "N/A"}</p>
        </div>
      </div>

      <div className="section-card">
        <h2>Today's Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments scheduled for today.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((apt) => (
              <div key={apt._id} className="appointment-item">
                <div>
                  <strong>{apt.patientId?.name}</strong>
                  <p>
                    {apt.timeSlot.startTime} - {apt.timeSlot.endTime}
                  </p>
                  <p className="text-muted">{apt.reason}</p>
                </div>
                <span className={`badge ${apt.status}`}>{apt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const response = await doctorService.getMyAppointments(params);
      setAppointments(response.data.data.appointments);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await doctorService.updateAppointmentStatus(id, newStatus);
      loadAppointments();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Appointments</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id}>
                <td>{apt.patientId?.name}</td>
                <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                <td>
                  {apt.timeSlot.startTime} - {apt.timeSlot.endTime}
                </td>
                <td>{apt.reason}</td>
                <td>
                  <span className={`badge ${apt.status}`}>{apt.status}</span>
                </td>
                <td>
                  {apt.status === "scheduled" && (
                    <button
                      onClick={() => handleStatusChange(apt._id, "completed")}
                      className="btn-small"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileView = ({ profile }) => {
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-field">
          <label>Name:</label>
          <p>{profile.userId?.name}</p>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <p>{profile.userId?.email}</p>
        </div>
        <div className="profile-field">
          <label>Phone:</label>
          <p>{profile.userId?.phone}</p>
        </div>
        <div className="profile-field">
          <label>Specialization:</label>
          <p>{profile.specialization}</p>
        </div>
        <div className="profile-field">
          <label>License Number:</label>
          <p>{profile.licenseNumber}</p>
        </div>
        <div className="profile-field">
          <label>Experience:</label>
          <p>{profile.experience} years</p>
        </div>
        <div className="profile-field">
          <label>Consultation Fee:</label>
          <p>Rs. {profile.consultationFee}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
