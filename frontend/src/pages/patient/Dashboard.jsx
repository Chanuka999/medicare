import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { patientService, billingService } from "../../services/api";
import "../../styles/Dashboard.css";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>MediFlow HMS</h2>
          <p className="user-badge">Patient</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/patient" className="nav-link">
            Dashboard
          </Link>
          <Link to="/patient/book-appointment" className="nav-link">
            Book Appointment
          </Link>
          <Link to="/patient/appointments" className="nav-link">
            My Appointments
          </Link>
          <Link to="/patient/medical-records" className="nav-link">
            Medical Records
          </Link>
          <Link to="/patient/bills" className="nav-link">
            My Bills
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
          <Route path="/" element={<HomeOverview />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/bills" element={<BillsList />} />
        </Routes>
      </main>
    </div>
  );
};

const HomeOverview = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadRecentAppointments();
  }, []);

  const loadRecentAppointments = async () => {
    try {
      const response = await patientService.getMyAppointments();
      setAppointments(response.data.data.appointments.slice(0, 3));
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <div className="welcome-card">
        <h2>Welcome to MediFlow HMS</h2>
        <p>
          Manage your appointments, view medical records, and track your bills
          all in one place.
        </p>
        <Link to="/patient/book-appointment">
          <button className="btn-primary">Book New Appointment</button>
        </Link>
      </div>

      <div className="section-card">
        <h2>Recent Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((apt) => (
              <div key={apt._id} className="appointment-item">
                <div>
                  <strong>Dr. {apt.doctorId?.userId?.name}</strong>
                  <p>{apt.doctorId?.specialization}</p>
                  <p>
                    {new Date(apt.appointmentDate).toLocaleDateString()} at{" "}
                    {apt.timeSlot.startTime}
                  </p>
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

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
    reason: "",
    priority: "normal",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await patientService.getDoctors();
      setDoctors(response.data.data.doctors);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await patientService.bookAppointment({
        doctorId: selectedDoctor,
        appointmentDate: formData.appointmentDate,
        timeSlot: {
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        reason: formData.reason,
        priority: formData.priority,
      });
      setSuccess("Appointment booked successfully!");
      setFormData({
        appointmentDate: "",
        startTime: "",
        endTime: "",
        reason: "",
        priority: "normal",
      });
      setSelectedDoctor("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Book Appointment</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.userId?.name} - {doctor.specialization} (Rs.{" "}
                  {doctor.consultationFee})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reason for Visit</label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              rows="4"
              required
              placeholder="Describe your symptoms or reason for consultation"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await patientService.getMyAppointments();
      setAppointments(response.data.data.appointments);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  const handleCancel = async (id) => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      await patientService.cancelAppointment(id, reason);
      loadAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  return (
    <div>
      <h1>My Appointments</h1>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id}>
                <td>Dr. {apt.doctorId?.userId?.name}</td>
                <td>{apt.doctorId?.specialization}</td>
                <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                <td>
                  {apt.timeSlot.startTime} - {apt.timeSlot.endTime}
                </td>
                <td>
                  <span className={`badge ${apt.status}`}>{apt.status}</span>
                </td>
                <td>
                  {apt.status === "scheduled" && (
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className="btn-danger-small"
                    >
                      Cancel
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

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const response = await patientService.getMyMedicalRecords();
      setRecords(response.data.data.records);
    } catch (error) {
      console.error("Failed to load records:", error);
    }
  };

  return (
    <div>
      <h1>My Medical Records</h1>
      {records.length === 0 ? (
        <p>No medical records yet.</p>
      ) : (
        <div className="records-list">
          {records.map((record) => (
            <div key={record._id} className="record-card">
              <div className="record-header">
                <h3>{new Date(record.createdAt).toLocaleDateString()}</h3>
                <p>
                  Dr. {record.doctorId?.userId?.name} -{" "}
                  {record.doctorId?.specialization}
                </p>
              </div>
              <div className="record-body">
                <p>
                  <strong>Diagnosis:</strong> {record.diagnosis}
                </p>
                {record.symptoms?.length > 0 && (
                  <p>
                    <strong>Symptoms:</strong> {record.symptoms.join(", ")}
                  </p>
                )}
                {record.prescription?.length > 0 && (
                  <div>
                    <strong>Prescription:</strong>
                    <ul>
                      {record.prescription.map((med, idx) => (
                        <li key={idx}>
                          {med.medicineName} - {med.dosage}, {med.frequency} for{" "}
                          {med.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {record.notes && (
                  <p>
                    <strong>Notes:</strong> {record.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BillsList = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const response = await billingService.getMyBills();
      setBills(response.data.data.bills);
    } catch (error) {
      console.error("Failed to load bills:", error);
    }
  };

  return (
    <div>
      <h1>My Bills</h1>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill.invoiceNumber}</td>
                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td>Rs. {bill.totalAmount}</td>
                <td>Rs. {bill.paidAmount}</td>
                <td>Rs. {bill.dueAmount}</td>
                <td>
                  <span className={`badge ${bill.paymentStatus}`}>
                    {bill.paymentStatus}
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

export default PatientDashboard;
