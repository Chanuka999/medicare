import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  patientService,
  billingService,
  reviewService,
} from "../../services/api";
import {
  FiGrid, FiUser, FiCalendar, FiList, FiFileText, FiDollarSign, FiStar, FiSearch, FiBell, FiChevronDown, FiActivity, FiLogOut
} from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, RadialBarChart, RadialBar, Legend
} from "recharts";
import StarRating from "../../components/StarRating";
import Notifications from "../../components/Notifications";
import "./DashboardDesign.css";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/patient", icon: <FiGrid /> },
    { name: "Profile", path: "/patient/profile", icon: <FiUser /> },
    { name: "Book Appointment", path: "/patient/book-appointment", icon: <FiCalendar /> },
    { name: "My Appointments", path: "/patient/appointments", icon: <FiList /> },
    { name: "Medical Records", path: "/patient/medical-records", icon: <FiFileText /> },
    { name: "My Bills", path: "/patient/bills", icon: <FiDollarSign /> },
    { name: "Review Doctors", path: "/patient/review-doctors", icon: <FiStar /> },
  ];

  const isActive = (path) => {
      if (path === "/patient") return location.pathname === "/patient";
      return location.pathname.startsWith(path);
  };

  return (
    <div className="p-dashboard-container">
      {/* Sidebar */}
      <aside className="p-sidebar">
        <div className="p-sidebar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="logo-box">C</div>
          <span>CarePoint</span>
        </div>
        
        <nav className="p-sidebar-nav">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`p-nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="p-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-sidebar-footer">
          <div className="p-user-summary">
            <img src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=0f766e&color=fff`} alt="user" />
            <div className="p-user-info">
              <span>{user?.name}</span>
              <p>Patient Account</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn-p">
             <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-main-content">
        <header className="p-top-header">
           <div className="p-search-wrapper">
              <FiSearch className="p-search-icon" />
              <input type="text" placeholder="Search for medical reports, doctors..." />
           </div>
           
           <div className="p-top-actions">
              <Notifications />
              <div className="p-prof-notif">
                 <span>Hi, {user?.name?.split(' ')[0]}</span>
                 <img src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=e2e8f0&color=475569`} alt="avatar" />
                 <FiChevronDown />
              </div>
           </div>
        </header>

        <div className="p-content-router">
          <Routes>
            <Route path="/" element={<HomeOverview user={user} />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/bills" element={<BillsList />} />
            <Route path="/review-doctors" element={<DoctorReviews />} />
            <Route path="/profile" element={<ProfileOverview user={user} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

/* Mock Data for Charts */
const testReportsData = [
  { name: '1 Mar', value: 30 },
  { name: '8 Mar', value: 80 },
  { name: '15 Mar', value: 45 },
  { name: '22 Mar', value: 120 },
  { name: '29 Mar', value: 90 },
];

const patientStats = [
  { name: 'New', value: 74, fill: '#f97316' },
  { name: 'Reported', value: 154, fill: '#1e293b' },
  { name: 'Released', value: 96, fill: '#0f766e' },
];

const geneticData = [
   { name: 'Mon', val: 40 }, { name: 'Tue', val: 70 }, { name: 'Wed', val: 90 },
   { name: 'Thu', val: 50 }, { name: 'Fri', val: 80 }, { name: 'Sat', val: 100 }, { name: 'Sun', val: 60 }
];

const totalReportsPie = [
  { name: 'Generated', value: 60, fill: '#f97316' },
  { name: 'Pending', value: 40, fill: '#1e293b' },
];

const HomeOverview = ({ user }) => {
  return (
    <div className="p-overview-wrapper">
       <h2 className="p-overview-title">Dashboard Overview</h2>
       
       <div className="p-grid-layout">
          {/* Test Reports Area Chart */}
          <div className="p-chart-card col-2">
             <div className="p-chart-header">
                <h3>Test Reports</h3>
                <button className="chart-btn">Show: This month</button>
             </div>
             <div className="chart-content-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={testReportsData}>
                      <defs>
                         <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0f766e" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Patient Status Radial Chart */}
          <div className="p-chart-card">
              <div className="p-chart-header">
                <h3>Patient Status</h3>
             </div>
             <div className="chart-content-wrapper">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={10} data={patientStats}>
                       <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="value" />
                       <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    </RadialBarChart>
                 </ResponsiveContainer>
             </div>
          </div>

          {/* Genetic Conditions Bar Chart */}
          <div className="p-chart-card">
              <div className="p-chart-header">
                <h3>Genetics Analytics</h3>
             </div>
             <div className="chart-content-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={geneticData}>
                      <Bar dataKey="val" fill="#0f766e" radius={[5, 5, 0, 0]} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Total Reports Pie Chart */}
          <div className="p-chart-card">
              <div className="p-chart-header">
                <h3>Total Reports</h3>
             </div>
             <div className="chart-content-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={totalReportsPie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {totalReportsPie.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Right Sidebar Elements */}
          <div className="p-sidebar-right">
             <div className="p-info-card">
                <h3>Patient Info</h3>
                <div className="p-info-avatar">
                   <img src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=f1f5f9&color=0f766e&size=128`} alt="user" />
                </div>
                <div className="p-info-name">{user?.name}</div>
                <div className="p-info-details">
                   <div className="p-detail-item"><span>Age</span><strong>23 Years</strong></div>
                   <div className="p-detail-item"><span>Gender</span><strong>Male</strong></div>
                   <div className="p-detail-item"><span>Email</span><strong>{user?.email}</strong></div>
                </div>
             </div>

             <div className="p-links-card">
                <h3>Quick Links</h3>
                <div className="p-link-item">
                   <div className="p-link-icon-box" style={{color: '#f97316'}}><FiFileText /></div>
                   <span className="p-link-name">Medical Reports</span>
                </div>
                <div className="p-link-item">
                   <div className="p-link-icon-box" style={{color: '#3b82f6'}}><FiActivity /></div>
                   <span className="p-link-name">Activity Logs</span>
                </div>
             </div>
          </div>
       </div>

       {/* Progress Tracker Section */}
       <div className="p-progress-section">
          <h3>Your Reports (Pre-Processing)</h3>
          <div className="p-stepper">
             <div className="p-step active">
                <span className="step-num">1</span>
                <span className="step-name">Order a kit</span>
             </div>
             <div className="p-step">
                <span className="step-num">2</span>
                <span className="step-name">Kit Shipment</span>
             </div>
             <div className="p-step">
                <span className="step-num">3</span>
                <span className="step-name">Sample Collection</span>
             </div>
             <div className="p-step">
                <span className="step-num">4</span>
                <span className="step-name">Process Sample</span>
             </div>
             <div className="p-step final">
                <span className="step-num">5</span>
                <span className="step-name">Generate Report</span>
             </div>
          </div>
       </div>
    </div>
  );
};

const ProfileOverview = ({ user }) => (
    <div className="section-card">
        <h2>Your Profile</h2>
        <div className="profile-details" style={{ marginTop: '20px' }}>
            <div className="profile-field" style={{ display: 'flex', gap: '20px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ fontWeight: 700, width: '150px' }}>Full Name</label>
                <p>{user?.name}</p>
            </div>
            <div className="profile-field" style={{ display: 'flex', gap: '20px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ fontWeight: 700, width: '150px' }}>Email Address</label>
                <p>{user?.email}</p>
            </div>
            <div className="profile-field" style={{ display: 'flex', gap: '20px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ fontWeight: 700, width: '150px' }}>Account Status</label>
                <p>Active</p>
            </div>
        </div>
    </div>
);

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

  useEffect(() => { loadDoctors(); }, []);

  const loadDoctors = async () => {
    try {
      const response = await patientService.getDoctors();
      const doctorsList = response.data.data.doctors;
      setDoctors(doctorsList);
      const ratings = {};
      await Promise.all(doctorsList.map(async (doctor) => {
          try {
            const ratingRes = await reviewService.getDoctorRatingStats(doctor._id);
            ratings[doctor._id] = ratingRes.data;
          } catch (err) { ratings[doctor._id] = { averageRating: 0, totalReviews: 0 }; }
      }));
      setDoctorRatings(ratings);
    } catch (error) { console.error("Failed to load doctors:", error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await patientService.bookAppointment({
        doctorId: selectedDoctor,
        appointmentDate: formData.appointmentDate,
        timeSlot: { startTime: formData.startTime, endTime: formData.endTime },
        reason: formData.reason, priority: formData.priority,
      });
      setSuccess("Appointment booked successfully!");
      setFormData({ appointmentDate: "", startTime: "", endTime: "", reason: "", priority: "normal" });
      setSelectedDoctor("");
    } catch (err) { setError(err.response?.data?.message || "Failed to book appointment"); } finally { setLoading(false); }
  };

  return (
    <div className="section-card">
      <h2>Book Appointment</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="form-group">
        <label>Select a Doctor</label>
        <div className="doctors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
          {doctors.map((doctor) => {
            const rating = doctorRatings[doctor._id] || { averageRating: 0, totalReviews: 0 };
            return (
              <div
                key={doctor._id}
                className={`doctor-card ${selectedDoctor === doctor._id ? "selected" : ""}`}
                onClick={() => setSelectedDoctor(doctor._id)}
                style={{ padding: '15px', border: selectedDoctor === doctor._id ? '2px solid #0f766e' : '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', background: selectedDoctor === doctor._id ? '#e0f2f1' : 'white' }}
              >
                <strong>Dr. {doctor.userId?.name}</strong>
                <p style={{fontSize: '0.8rem', color: '#64748b'}}>{doctor.specialization}</p>
                <StarRating rating={rating.averageRating} readonly size={14} />
              </div>
            );
          })}
        </div>
      </div>

      {selectedDoctor && (
        <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={formData.appointmentDate} onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
             <div style={{flex: 1}}>
                <label>Start Time</label>
                <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }} />
             </div>
             <div style={{flex: 1}}>
                <label>End Time</label>
                <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }} />
             </div>
          </div>
          <div className="form-group">
            <label>Reason</label>
            <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required rows="3" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }} />
          </div>
          <button type="submit" className="signin-btn" style={{ background: '#0f766e', color: 'white' }}>{loading ? "Booking..." : "Book Appointment"}</button>
        </form>
      )}
    </div>
  );
};

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    useEffect(() => { loadAppointments(); }, []);
    const loadAppointments = async () => {
        try {
            const response = await patientService.getMyAppointments();
            setAppointments(response.data.data.appointments);
        } catch (error) { console.error(error); }
    };
    return (
        <div className="section-card">
            <h2>My Appointments</h2>
            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '12px' }}>Doctor</th>
                            <th style={{ padding: '12px' }}>Date</th>
                            <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(apt => (
                            <tr key={apt._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px' }}>Dr. {apt.doctorId?.userId?.name}</td>
                                <td style={{ padding: '12px' }}>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', background: apt.status === 'scheduled' ? '#e0f2fe' : '#fef2f2', color: apt.status === 'scheduled' ? '#0369a1' : '#b91c1c' }}>
                                        {apt.status}
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

const MedicalRecords = () => {
    const [records, setRecords] = useState([]);
    useEffect(() => { loadRecords(); }, []);
    const loadRecords = async () => {
        try {
            const response = await patientService.getMyMedicalRecords();
            setRecords(response.data?.data?.records || []);
        } catch (error) { console.error(error); }
    };
    return (
        <div className="section-card">
            <h2>Medical Records</h2>
            <div style={{ marginTop: '20px' }}>
                {records.length === 0 ? <p>No records found.</p> : records.map(record => (
                    <div key={record._id} style={{ padding: '20px', border: '1px solid #f1f5f9', borderRadius: '12px', marginBottom: '15px' }}>
                        <strong>{new Date(record.createdAt).toLocaleDateString()}</strong>
                        <p>Diagnosis: {record.diagnosis}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BillsList = () => {
    const [bills, setBills] = useState([]);
    useEffect(() => { loadBills(); }, []);
    const loadBills = async () => {
        try {
            const response = await billingService.getMyBills();
            setBills(response.data.data.bills);
        } catch (error) { console.error(error); }
    };
    return (
        <div className="section-card">
            <h2>My Bills</h2>
            <div style={{ marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '12px' }}>Invoice</th>
                            <th style={{ padding: '12px' }}>Amount</th>
                            <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map(bill => (
                            <tr key={bill._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px' }}>{bill.invoiceNumber}</td>
                                <td style={{ padding: '12px' }}>Rs. {bill.totalAmount}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', background: bill.paymentStatus === 'paid' ? '#dcfce7' : '#fef2f2', color: bill.paymentStatus === 'paid' ? '#15803d' : '#b91c1c' }}>
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
    useEffect(() => { loadDoctors(); }, []);
    const loadDoctors = async () => {
        try {
            const response = await patientService.getDoctors();
            setDoctors(response.data.data.doctors);
        } catch (error) { console.error(error); }
    };
    return (
        <div className="section-card">
            <h2>Review Doctors</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Choose a doctor you've visited to share your experience.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {doctors.map(doc => (
                    <div key={doc._id} style={{ padding: '15px', border: '1px solid #f1f5f9', borderRadius: '12px', textAlign: 'center' }}>
                         <img src={`https://ui-avatars.com/api/?name=${doc.userId?.name}&background=random`} style={{ width: '60px', borderRadius: '50%', marginBottom: '10px' }} alt="" />
                         <strong>Dr. {doc.userId?.name}</strong>
                         <p style={{fontSize: '0.8rem', color: '#64748b'}}>{doc.specialization}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientDashboard;
