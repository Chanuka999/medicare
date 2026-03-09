import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useAuth } from "../../context/AuthContext";
import { doctorService } from "../../services/api";
import Notifications from "../../components/Notifications";
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
          <Link to="/doctor/prescriptions" className="nav-link">
            Prescriptions
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
        <div className="main-header">
          <div></div>
          <Notifications />
        </div>
        <Routes>
          <Route path="/" element={<HomeOverview profile={profile} />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route
            path="/prescriptions"
            element={<PrescriptionBuilder user={user} />}
          />
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
        <div className="stat-card stat-card-blue">
          <h3>Today's Appointments</h3>
          <p className="stat-number">{appointments.length}</p>
        </div>
        <div className="stat-card stat-card-green">
          <h3>Total Patients</h3>
          <p className="stat-number">{profile?.totalPatients || 0}</p>
        </div>
        <div className="stat-card stat-card-orange">
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

const PrescriptionBuilder = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [medicines, setMedicines] = useState([
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await doctorService.getMyAppointments();
      setAppointments(response.data?.data?.appointments || []);
    } catch (loadError) {
      console.error("Failed to load appointments:", loadError);
      setError("Unable to load appointments");
    }
  };

  const selectedAppointment = appointments.find(
    (item) => item._id === selectedAppointmentId,
  );

  const handleMedicineChange = (index, field, value) => {
    setMedicines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedicine = (index) => {
    setMedicines((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const generatePrescriptionPdf = async () => {
    setError("");

    if (!selectedAppointment) {
      setError("Please select an appointment/patient");
      return;
    }

    const validMedicines = medicines.filter(
      (item) =>
        item.medicineName && item.dosage && item.frequency && item.duration,
    );

    if (validMedicines.length === 0) {
      setError("Please add at least one medicine with dosage details");
      return;
    }

    // Save medical record to database first
    try {
      await doctorService.createMedicalRecord({
        patientId: selectedAppointment.patientId._id,
        appointmentId: selectedAppointment._id,
        diagnosis: "Prescription issued",
        prescription: validMedicines,
        notes: notes,
      });
    } catch (saveError) {
      console.error("Failed to save medical record:", saveError);
      setError("Failed to save medical record to database");
      return;
    }

    const doc = new jsPDF();
    const dateText = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text("MediFlow HMS - Digital Prescription", 14, 20);

    doc.setFontSize(11);
    doc.text(`Date: ${dateText}`, 14, 30);
    doc.text(`Doctor: ${user?.name || "N/A"}`, 14, 37);
    doc.text(
      `Patient: ${selectedAppointment.patientId?.name || "N/A"}`,
      14,
      44,
    );
    doc.text(
      `Appointment: ${new Date(selectedAppointment.appointmentDate).toLocaleDateString()}`,
      14,
      51,
    );

    doc.setFontSize(13);
    doc.text("Medicines", 14, 63);

    let y = 72;
    validMedicines.forEach((item, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.text(`${index + 1}. ${item.medicineName}`, 14, y);
      y += 6;
      doc.text(`Dosage: ${item.dosage}`, 20, y);
      y += 6;
      doc.text(`Frequency: ${item.frequency}`, 20, y);
      y += 6;
      doc.text(`Duration: ${item.duration}`, 20, y);
      y += 6;
      if (item.instructions) {
        doc.text(`Instructions: ${item.instructions}`, 20, y);
        y += 6;
      }
      y += 2;
    });

    if (notes) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.text("Additional Notes", 14, y + 6);
      doc.setFontSize(11);
      doc.text(notes, 14, y + 14, { maxWidth: 180 });
    }

    const patientName = (selectedAppointment.patientId?.name || "patient")
      .replace(/\s+/g, "-")
      .toLowerCase();
    doc.save(`prescription-${patientName}-${Date.now()}.pdf`);
  };

  return (
    <div>
      <h1>Digital Prescription</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="form-card prescription-card">
        <div className="form-group">
          <label>Select Appointment / Patient</label>
          <select
            value={selectedAppointmentId}
            onChange={(event) => setSelectedAppointmentId(event.target.value)}
            required
          >
            <option value="">Choose appointment</option>
            {appointments.map((appointment) => (
              <option key={appointment._id} value={appointment._id}>
                {appointment.patientId?.name} -{" "}
                {new Date(appointment.appointmentDate).toLocaleDateString()} (
                {appointment.timeSlot?.startTime})
              </option>
            ))}
          </select>
        </div>

        <div className="prescription-header-row">
          <h3>Medicines</h3>
          <button type="button" className="btn-small" onClick={addMedicine}>
            Add Medicine
          </button>
        </div>

        {medicines.map((medicine, index) => (
          <div
            key={`${index}-${medicine.medicineName}`}
            className="prescription-row"
          >
            <input
              type="text"
              placeholder="Medicine Name"
              value={medicine.medicineName}
              onChange={(event) =>
                handleMedicineChange(index, "medicineName", event.target.value)
              }
            />
            <input
              type="text"
              placeholder="Dosage (e.g. 500mg)"
              value={medicine.dosage}
              onChange={(event) =>
                handleMedicineChange(index, "dosage", event.target.value)
              }
            />
            <input
              type="text"
              placeholder="Frequency (e.g. Twice daily)"
              value={medicine.frequency}
              onChange={(event) =>
                handleMedicineChange(index, "frequency", event.target.value)
              }
            />
            <input
              type="text"
              placeholder="Duration (e.g. 5 days)"
              value={medicine.duration}
              onChange={(event) =>
                handleMedicineChange(index, "duration", event.target.value)
              }
            />
            <input
              type="text"
              placeholder="Instructions (after meal, etc.)"
              value={medicine.instructions}
              onChange={(event) =>
                handleMedicineChange(index, "instructions", event.target.value)
              }
            />
            <button
              type="button"
              className="btn-danger-small"
              onClick={() => removeMedicine(index)}
              disabled={medicines.length === 1}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label>Additional Notes</label>
          <textarea
            rows="3"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="General advice, follow-up instructions, etc."
          />
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={generatePrescriptionPdf}
        >
          Download Prescription PDF
        </button>
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
