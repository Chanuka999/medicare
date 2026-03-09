import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  patientService,
  billingService,
  reviewService,
} from "../../services/api";
import StarRating from "../../components/StarRating";
import Notifications from "../../components/Notifications";
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
          <Link to="/patient/review-doctors" className="nav-link">
            Review Doctors
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
          <Route path="/" element={<HomeOverview />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/bills" element={<BillsList />} />
          <Route path="/review-doctors" element={<DoctorReviews />} />
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
  const [doctorRatings, setDoctorRatings] = useState({});
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
      const doctorsList = response.data.data.doctors;
      setDoctors(doctorsList);

      // Load ratings for each doctor
      const ratings = {};
      await Promise.all(
        doctorsList.map(async (doctor) => {
          try {
            const ratingRes = await reviewService.getDoctorRatingStats(
              doctor._id,
            );
            ratings[doctor._id] = ratingRes.data;
          } catch (err) {
            ratings[doctor._id] = { averageRating: 0, totalReviews: 0 };
          }
        }),
      );
      setDoctorRatings(ratings);
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

      <div className="section-card">
        <h3>Select a Doctor</h3>
        <div className="doctors-grid">
          {doctors.map((doctor) => {
            const rating = doctorRatings[doctor._id] || {
              averageRating: 0,
              totalReviews: 0,
            };
            return (
              <div
                key={doctor._id}
                className={`doctor-card ${selectedDoctor === doctor._id ? "selected" : ""}`}
                onClick={() => setSelectedDoctor(doctor._id)}
              >
                <div className="doctor-card-header">
                  <h4>Dr. {doctor.userId?.name}</h4>
                  <span className="doctor-specialization">
                    {doctor.specialization}
                  </span>
                </div>
                <div className="doctor-rating">
                  <StarRating
                    rating={rating.averageRating}
                    readonly
                    size={16}
                  />
                  <span className="review-count-small">
                    ({rating.totalReviews}{" "}
                    {rating.totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>
                <div className="doctor-fee">
                  <strong>Consultation Fee:</strong> Rs.{" "}
                  {doctor.consultationFee}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDoctor && (
        <div className="form-card">
          <h3>Appointment Details</h3>
          <form onSubmit={handleSubmit}>
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
      )}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await patientService.getMyMedicalRecords();
      setRecords(response.data?.data?.records || []);
    } catch (error) {
      console.error("Failed to load records:", error);
      setError(
        error.response?.data?.message || "Failed to load medical records",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>My Medical Records</h1>
      {loading ? (
        <p>Loading medical records...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : records.length === 0 ? (
        <p>
          No medical records yet. Records appear after a doctor creates a
          prescription or medical note for your account.
        </p>
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

const DoctorReviews = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });
  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      loadDoctorReviews(selectedDoctor);
      loadRatingStats(selectedDoctor);
      checkIfReviewed(selectedDoctor);
    }
  }, [selectedDoctor]);

  const loadDoctors = async () => {
    try {
      const response = await patientService.getDoctors();
      setDoctors(response.data.data.doctors);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  };

  const loadDoctorReviews = async (doctorId) => {
    try {
      const response = await reviewService.getDoctorReviews(doctorId);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  const loadRatingStats = async (doctorId) => {
    try {
      const response = await reviewService.getDoctorRatingStats(doctorId);
      setRatingStats(response.data);
    } catch (error) {
      console.error("Failed to load rating stats:", error);
    }
  };

  const checkIfReviewed = async (doctorId) => {
    try {
      const response = await reviewService.checkPatientReview(doctorId);
      setHasReviewed(response.data.hasReviewed);
      setExistingReview(response.data.review);
      if (response.data.review) {
        setReviewForm({
          rating: response.data.review.rating,
          comment: response.data.review.comment,
        });
      }
    } catch (error) {
      console.error("Failed to check review:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (reviewForm.rating === 0) {
      setError("Please select a rating");
      setLoading(false);
      return;
    }

    try {
      if (hasReviewed && existingReview) {
        await reviewService.updateReview(existingReview._id, reviewForm);
        setSuccess("Review updated successfully!");
      } else {
        await reviewService.createReview({
          doctorId: selectedDoctor,
          ...reviewForm,
        });
        setSuccess("Review submitted successfully!");
      }
      setShowReviewForm(false);
      loadDoctorReviews(selectedDoctor);
      loadRatingStats(selectedDoctor);
      checkIfReviewed(selectedDoctor);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      await reviewService.deleteReview(existingReview._id);
      setSuccess("Review deleted successfully!");
      setHasReviewed(false);
      setExistingReview(null);
      setReviewForm({ rating: 0, comment: "" });
      loadDoctorReviews(selectedDoctor);
      loadRatingStats(selectedDoctor);
    } catch (error) {
      setError("Failed to delete review");
    }
  };

  return (
    <div>
      <h1>Review Doctors</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-card">
        <div className="form-group">
          <label>Select Doctor</label>
          <select
            value={selectedDoctor || ""}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.userId?.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedDoctor && ratingStats && (
        <div className="section-card">
          <h2>Doctor Rating Overview</h2>
          <div className="rating-overview">
            <div className="rating-summary">
              <div className="average-rating-large">
                {ratingStats.averageRating.toFixed(1)}
              </div>
              <StarRating
                rating={ratingStats.averageRating}
                readonly
                size={24}
              />
              <p className="rating-count">
                Based on {ratingStats.totalReviews} review
                {ratingStats.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="rating-bar-row">
                  <span className="star-label">{star} ★</span>
                  <div className="rating-bar-track">
                    <div
                      className="rating-bar-fill"
                      style={{
                        width: `${ratingStats.totalReviews > 0 ? (ratingStats.ratingDistribution[star] / ratingStats.totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="rating-bar-count">
                    {ratingStats.ratingDistribution[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!showReviewForm && (
            <div style={{ marginTop: "1.5rem" }}>
              {hasReviewed ? (
                <div>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn-primary"
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit Your Review
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    className="btn-danger-small"
                  >
                    Delete Review
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-primary"
                >
                  Write a Review
                </button>
              )}
            </div>
          )}

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <h3>{hasReviewed ? "Edit Your Review" : "Write a Review"}</h3>
              <div className="form-group">
                <label>Rating</label>
                <StarRating
                  rating={reviewForm.rating}
                  onRatingChange={(rating) =>
                    setReviewForm({ ...reviewForm, rating })
                  }
                  size={32}
                />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  rows="4"
                  required
                  maxLength="500"
                  placeholder="Share your experience with this doctor..."
                />
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Submitting..."
                    : hasReviewed
                      ? "Update Review"
                      : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-small"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {selectedDoctor && reviews.length > 0 && (
        <div className="section-card">
          <h2>Patient Reviews</h2>
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div>
                    <strong>{review.patientId?.name || "Anonymous"}</strong>
                    <StarRating rating={review.rating} readonly size={16} />
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
