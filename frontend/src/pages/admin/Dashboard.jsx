import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/api";
import Notifications from "../../components/Notifications";
import DailyAppointmentsChart from "../../components/charts/DailyAppointmentsChart";
import MonthlyRevenueChart from "../../components/charts/MonthlyRevenueChart";
import MostVisitedDoctorsChart from "../../components/charts/MostVisitedDoctorsChart";
import PatientGrowthChart from "../../components/charts/PatientGrowthChart";
import "../../components/charts/Charts.css";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
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
          <p className="user-badge">Admin</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-link">
            Dashboard
          </Link>
          <Link to="/admin/doctors" className="nav-link">
            Manage Doctors
          </Link>
          <Link to="/admin/users" className="nav-link">
            Manage Users
          </Link>
          <Link to="/admin/appointments" className="nav-link">
            Appointments
          </Link>
          <Link to="/admin/billing" className="nav-link">
            Billing
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
        <div className="main-header">
          <div></div>
          <Notifications />
        </div>
        <Routes>
          <Route path="/" element={<HomeStats stats={stats} />} />
          <Route path="/doctors" element={<DoctorsManagement />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route
            path="/appointments"
            element={<div>Appointments Management (Coming Soon)</div>}
          />
          <Route
            path="/billing"
            element={<div>Billing Management (Coming Soon)</div>}
          />
        </Routes>
      </main>
    </div>
  );
};

const HomeStats = ({ stats }) => {
  const userRoleData = [
    {
      label: "Admins",
      value: stats?.userRoleCounts?.admin || 0,
      className: "admin",
    },
    {
      label: "Doctors",
      value: stats?.userRoleCounts?.doctor || 0,
      className: "doctor",
    },
    {
      label: "Patients",
      value: stats?.userRoleCounts?.patient || 0,
      className: "patient",
    },
  ];

  const appointmentStatusData = [
    {
      label: "Scheduled",
      value: stats?.appointmentStatusCounts?.scheduled || 0,
      className: "scheduled",
    },
    {
      label: "Completed",
      value: stats?.appointmentStatusCounts?.completed || 0,
      className: "completed",
    },
    {
      label: "Cancelled",
      value: stats?.appointmentStatusCounts?.cancelled || 0,
      className: "cancelled",
    },
    {
      label: "No Show",
      value: stats?.appointmentStatusCounts?.noShow || 0,
      className: "noshow",
    },
  ];

  const maxMonthlyAppointments = Math.max(
    1,
    ...(stats?.monthlyAppointments?.map((item) => item.count) || [0]),
  );

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card stat-card-purple">
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card stat-card-blue">
          <h3>Total Patients</h3>
          <p className="stat-number">{stats?.totalPatients || 0}</p>
        </div>
        <div className="stat-card stat-card-green">
          <h3>Total Doctors</h3>
          <p className="stat-number">{stats?.totalDoctors || 0}</p>
        </div>
        <div className="stat-card stat-card-orange">
          <h3>Total Admins</h3>
          <p className="stat-number">{stats?.totalAdmins || 0}</p>
        </div>
        <div className="stat-card stat-card-teal">
          <h3>Active Users</h3>
          <p className="stat-number">{stats?.activeUsers || 0}</p>
        </div>
        <div className="stat-card stat-card-pink">
          <h3>Total Appointments</h3>
          <p className="stat-number">{stats?.totalAppointments || 0}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>User Distribution by Role</h3>
          {userRoleData.map((item) => {
            const total = stats?.totalUsers || 1;
            const percent = Math.round((item.value / total) * 100);
            return (
              <div key={item.label} className="chart-row">
                <div className="chart-label-row">
                  <span>{item.label}</span>
                  <span>
                    {item.value} ({percent}%)
                  </span>
                </div>
                <div className="chart-track">
                  <div
                    className={`chart-fill ${item.className}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="chart-card">
          <h3>Appointments by Status</h3>
          {appointmentStatusData.map((item) => {
            const total = stats?.totalAppointments || 1;
            const percent = Math.round((item.value / total) * 100);
            return (
              <div key={item.label} className="chart-row">
                <div className="chart-label-row">
                  <span>{item.label}</span>
                  <span>
                    {item.value} ({percent}%)
                  </span>
                </div>
                <div className="chart-track">
                  <div
                    className={`chart-fill ${item.className}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-card monthly-chart-card">
        <h3>Appointments Trend (Last 6 Months)</h3>
        <div className="monthly-bars">
          {(stats?.monthlyAppointments || []).map((item) => {
            const height = Math.max(
              8,
              Math.round((item.count / maxMonthlyAppointments) * 100),
            );
            return (
              <div
                key={`${item.month}-${item.year}`}
                className="monthly-bar-item"
              >
                <div className="monthly-value">{item.count}</div>
                <div className="monthly-bar-track">
                  <div
                    className="monthly-bar-fill"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="monthly-label">{item.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Statistics Charts */}
      <div style={{ marginTop: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "2rem",
            color: "var(--text-main)",
          }}
        >
          Advanced Analytics
        </h2>
        <div className="charts-grid">
          <DailyAppointmentsChart />
          <MonthlyRevenueChart />
        </div>
        <PatientGrowthChart />
        <MostVisitedDoctorsChart />
      </div>
    </div>
  );
};

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await adminService.getDoctors();
      setDoctors(response.data.data.doctors);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Manage Doctors</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Add Doctor"}
        </button>
      </div>

      {showForm && (
        <DoctorForm
          onSuccess={() => {
            setShowForm(false);
            loadDoctors();
          }}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>License No</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.userId?.name}</td>
                <td>{doctor.userId?.email}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.licenseNumber}</td>
                <td>Rs. {doctor.consultationFee}</td>
                <td>
                  <span className={`badge ${doctor.userId?.status}`}>
                    {doctor.userId?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DoctorForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    consultationFee: "",
    experience: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminService.createDoctor(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-card">
      <h3>Add New Doctor</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />
        <input
          name="specialization"
          placeholder="Specialization"
          onChange={handleChange}
          required
        />
        <input
          name="licenseNumber"
          placeholder="License Number"
          onChange={handleChange}
          required
        />
        <input
          name="consultationFee"
          type="number"
          placeholder="Consultation Fee"
          onChange={handleChange}
          required
        />
        <input
          name="experience"
          type="number"
          placeholder="Experience (years)"
          onChange={handleChange}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Creating..." : "Create Doctor"}
        </button>
      </form>
    </div>
  );
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      loadUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge">{user.role}</span>
                </td>
                <td>{user.phone}</td>
                <td>
                  <span className={`badge ${user.status}`}>{user.status}</span>
                </td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleStatusChange(user._id, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
