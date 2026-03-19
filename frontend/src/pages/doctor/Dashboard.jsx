import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doctorService } from "../../services/api";
import {
    FiGrid, FiCalendar, FiUsers, FiClock, FiDollarSign, FiBarChart2, FiPieChart, FiHelpCircle, FiSettings, FiSearch, FiBell, FiLogOut
} from "react-icons/fi";
import {
    BarChart, Bar, ResponsiveContainer, Tooltip, Cell, XAxis, YAxis
} from "recharts";
import Notifications from "../../components/Notifications";
import "./DoctorDashboardDesign.css";

const DoctorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
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

    const navSections = [
        {
            title: "Main",
            items: [
                { name: "Dashboard", path: "/doctor", icon: <FiGrid /> },
                { name: "Schedules", path: "/doctor/schedules", icon: <FiCalendar /> },
                { name: "Patients", path: "/doctor/patients", icon: <FiUsers /> },
                { name: "Appointments", path: "/doctor/appointments", icon: <FiClock /> },
                { name: "Billing", path: "/doctor/billing", icon: <FiDollarSign /> },
            ]
        },
        {
            title: "Data Visualization",
            items: [
                { name: "Echarts", path: "/doctor/echarts", icon: <FiBarChart2 /> },
                { name: "Morris Charts", path: "/doctor/morris", icon: <FiPieChart /> },
            ]
        },
        {
            title: "Support",
            items: [
                { name: "Help Center", path: "/doctor/help", icon: <FiHelpCircle /> },
                { name: "Settings", path: "/doctor/settings", icon: <FiSettings /> },
            ]
        }
    ];

    const isActive = (path) => {
        if (path === "/doctor") return location.pathname === "/doctor";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="d-dashboard-container">
            {/* Sidebar */}
            <aside className="d-sidebar">
                <div className="d-sidebar-logo">
                    <div style={{ background: '#3b82f6', color: 'white', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                    <span>Mediczen™</span>
                </div>

                <div className="d-header-search" style={{ width: '100%', marginBottom: '20px' }}>
                    <FiSearch className="d-icon" />
                    <input type="text" placeholder="Search" />
                </div>

                <nav className="d-sidebar-nav">
                    {navSections.map((section, sIdx) => (
                        <div key={sIdx} className="d-nav-section">
                            <div className="d-nav-section-title">{section.title}</div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`d-nav-link ${isActive(item.path) ? 'active' : ''}`}
                                >
                                    <span className="d-nav-icon">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="d-sidebar-footer">
                   <div style={{display: 'flex', alignItems: 'center', gap: '15px', color: '#64748b', fontSize: '0.9rem', cursor: 'pointer'}} onClick={handleLogout}>
                       <FiLogOut /> <span>Logout</span>
                   </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="d-main-content">
                <header className="d-header">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Good Morning, Dr. {user?.name?.split(' ')[0]}!</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>I hope you're in a good mood because there are {profile?.totalPatients || 5} patients waiting for you</p>
                    </div>

                    <div className="d-header-actions">
                        <div className="d-icon-btn"><FiSettings /></div>
                        <Notifications />
                        <div className="d-user-profile" onClick={() => navigate('/doctor/profile')} style={{cursor: 'pointer'}}>
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || "Doctor"}&background=3b82f6&color=fff`} alt="user" />
                        </div>
                    </div>
                </header>

                <div className="inner-content">
                    <Routes>
                        <Route path="/" element={<HomeOverview profile={profile} />} />
                        <Route path="/appointments" element={<AppointmentsList />} />
                        <Route path="/patients" element={<PatientsList />} />
                        <Route path="/profile" element={<ProfileView profile={profile} />} />
                        <Route path="/billing" element={<ComingSoon feature="Billing" />} />
                        <Route path="/schedules" element={<SchedulesTimeline />} />
                        <Route path="/help" element={<ComingSoon feature="Help Center" />} />
                        <Route path="/settings" element={<ComingSoon feature="Settings" />} />
                        <Route path="/echarts" element={<ComingSoon feature="Echarts" />} />
                        <Route path="/morris" element={<ComingSoon feature="Morris Charts" />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

/* Mock Data for Mini Charts */
const bedsData = [ { v: 40 }, { v: 30 }, { v: 60 }, { v: 50 }, { v: 90 }, { v: 70 } ];
const docsData = [ { v: 30 }, { v: 50 }, { v: 40 }, { v: 80 }, { v: 60 }, { v: 95 } ];
const ambuData = [ { v: 20 }, { v: 40 }, { v: 30 }, { v: 70 }, { v: 55 }, { v: 85 } ];

const HomeOverview = ({ profile }) => {
    return (
        <div className="d-overview-wrapper">
            {/* Top Stat Cards */}
            <div className="d-stats-row">
                <div className="d-stat-card">
                    <div className="d-stat-details">
                        <h4>Beds</h4>
                        <p className="d-number">86</p>
                        <small style={{ color: '#94a3b8' }}>Available hospital beds</small>
                    </div>
                    <div style={{ width: '80px', height: '60px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bedsData}><Bar dataKey="v" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="d-stat-card">
                    <div className="d-stat-details">
                        <h4>Doctors</h4>
                        <p className="d-number">126</p>
                        <small style={{ color: '#94a3b8' }}>Available doctors</small>
                    </div>
                    <div style={{ width: '80px', height: '60px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={docsData}><Bar dataKey="v" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="d-stat-card">
                    <div className="d-stat-details">
                        <h4>Ambulance</h4>
                        <p className="d-number">32</p>
                        <small style={{ color: '#94a3b8' }}>Available ambulance</small>
                    </div>
                    <div style={{ width: '80px', height: '60px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ambuData}><Bar dataKey="v" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="d-grid-2-1">
                {/* Patient List */}
                <div className="d-card">
                    <div className="d-card-header">
                        <h3>Patient List</h3>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Sort: A - Z</span>
                            <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>See All</span>
                        </div>
                    </div>
                    <table className="d-table">
                        <thead>
                            <tr><th>Name</th><th>Ward No.</th><th>Priority</th><th>Start Date</th><th>End Date</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="d-patient-info">
                                        <img src="https://i.pravatar.cc/40?u=123" className="d-patient-avatar" />
                                        <div className="d-patient-meta"><span>Adam Messy</span><small>Male, 26 Years</small></div>
                                    </div>
                                </td>
                                <td>#123456</td>
                                <td><span className="d-badge medium">Medium</span></td>
                                <td>June 3, 2023</td>
                                <td style={{ color: '#cbd5e1' }}>— — —</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-patient-info">
                                        <img src="https://i.pravatar.cc/40?u=124" className="d-patient-avatar" />
                                        <div className="d-patient-meta"><span>Celine Aluista</span><small>Female, 22 Years</small></div>
                                    </div>
                                </td>
                                <td>#985746</td>
                                <td><span className="d-badge low">Low</span></td>
                                <td>May 31, 2023</td>
                                <td>June 4, 2023</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-patient-info">
                                        <img src="https://i.pravatar.cc/40?u=125" className="d-patient-avatar" />
                                        <div className="d-patient-meta"><span>Malachi Ardo</span><small>Male, 19 Years</small></div>
                                    </div>
                                </td>
                                <td>#047638</td>
                                <td><span className="d-badge high">High</span></td>
                                <td>June 7, 2023</td>
                                <td style={{ color: '#cbd5e1' }}>— — —</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Calendar Placeholder */}
                <div className="d-card">
                    <div className="d-card-header">
                        <h3>June 2023</h3>
                        <div style={{ display: 'flex', gap: '5px' }}><FiCalendar style={{ color: '#3b82f6' }} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontSize: '0.8rem' }}>
                        {['MN', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => <div key={d} style={{ color: '#94a3b8', fontWeight: 700 }}>{d}</div>)}
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} style={{ padding: '8px', borderRadius: '50%', background: i === 7 ? '#3b82f6' : 'transparent', color: i === 7 ? 'white' : '#1e293b', fontWeight: i === 7 ? 800 : 500 }}>{i + 1}</div>
                        ))}
                    </div>
                    <div style={{marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px'}}>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px'}}>
                            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6'}}></div>
                            <span style={{fontSize: '0.8rem', color: '#64748b'}}>Surgery</span>
                        </div>
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#ff4444'}}></div>
                            <span style={{fontSize: '0.8rem', color: '#64748b'}}>Polyclinic</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Section */}
            <div className="d-card">
                <div className="d-card-header"><h3>Schedule</h3><span style={{ fontSize: '0.85rem', color: '#64748b' }}>January - February 2023</span></div>
                <div className="d-schedule-container">
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                        <div style={{ width: '80px', color: '#94a3b8', fontSize: '0.8rem' }}>09:00</div>
                        <div style={{ flex: 1, padding: '15px', background: '#f0fdf4', color: '#166534', borderRadius: '12px', fontSize: '0.9rem', borderLeft: '4px solid #22c55e' }}>Check up patient</div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                        <div style={{ width: '80px', color: '#94a3b8', fontSize: '0.8rem' }}>11:30</div>
                        <div style={{ flex: 1, padding: '15px', background: '#fff1f2', color: '#991b1b', borderRadius: '12px', fontSize: '0.9rem', borderLeft: '4px solid #ef4444' }}>Lunch Break</div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                        <div style={{ width: '80px', color: '#94a3b8', fontSize: '0.8rem' }}>13:00</div>
                        <div style={{ flex: 1, padding: '15px', background: '#eff6ff', color: '#1e40af', borderRadius: '12px', fontSize: '0.9rem', borderLeft: '4px solid #3b82f6' }}>Heart Surgery</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ComingSoon = ({ feature }) => (
    <div className="d-card" style={{ textAlign: 'center', padding: '100px 0' }}>
        <FiClock style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '20px' }} />
        <h2>{feature}</h2>
        <p style={{ color: '#64748b' }}>We are currently building this section to provide you the best experience.</p>
    </div>
);

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    useEffect(() => { loadAppointments(); }, []);
    const loadAppointments = async () => {
        try {
            const response = await doctorService.getMyAppointments();
            setAppointments(response.data.data.appointments);
        } catch (error) { console.error(error); }
    };
    return (
        <div className="d-card">
            <div className="d-card-header"><h3>Current Appointments</h3></div>
            <table className="d-table">
                <thead>
                    <tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th></tr>
                </thead>
                <tbody>
                    {appointments.map(apt => (
                        <tr key={apt._id}>
                            <td>
                                <div className="d-patient-info">
                                    <div className="d-patient-meta"><span>{apt.patientId?.name}</span></div>
                                </div>
                            </td>
                            <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                            <td>{apt.timeSlot.startTime}</td>
                            <td>{apt.reason}</td>
                            <td><span className={`d-badge ${apt.status === 'scheduled' ? 'medium' : 'low'}`}>{apt.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PatientsList = () => (
    <div className="d-card">
        <h3>Patient Records</h3>
        <p style={{marginTop: '20px', color: '#64748b'}}>Patient record management coming soon.</p>
    </div>
);

const SchedulesTimeline = () => (
    <div className="d-card">
        <h3>Schedules</h3>
        <p style={{marginTop: '20px', color: '#64748b'}}>Detailed weekly schedule view coming soon.</p>
    </div>
);

const ProfileView = ({ profile }) => (
    <div className="d-card">
        <h3>My Profile</h3>
        <div style={{ marginTop: '25px' }}>
            <div style={{ marginBottom: '15px' }}><strong>Specialization:</strong> {profile?.specialization}</div>
            <div style={{ marginBottom: '15px' }}><strong>License:</strong> {profile?.licenseNumber}</div>
            <div style={{ marginBottom: '15px' }}><strong>Fee:</strong> Rs. {profile?.consultationFee}</div>
            <div style={{ marginBottom: '15px' }}><strong>Experience:</strong> {profile?.experience} Years</div>
        </div>
    </div>
);

export default DoctorDashboard;
