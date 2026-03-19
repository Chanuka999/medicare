import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/api";
import {
    FiGrid, FiUsers, FiLayers, FiHome, FiHeart, FiBriefcase, FiUser, FiSearch, FiBell, FiLogOut, FiPlus, FiArrowRight, FiActivity, FiDatabase
} from "react-icons/fi";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from "recharts";
import Notifications from "../../components/Notifications";
import "./AdminDashboardDesign.css";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
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

    const menuItems = [
        { name: "Dashboard", path: "/admin", icon: <FiGrid /> },
        { name: "Staff", path: "/admin/doctors", icon: <FiUsers /> },
        { name: "Lab", path: "/admin/lab", icon: <FiLayers /> },
        { name: "Ward", path: "/admin/ward", icon: <FiHome /> },
        { name: "Treatment", path: "/admin/treatment", icon: <FiActivity /> },
        { name: "Pharmacy", path: "/admin/pharmacy", icon: <FiHeart /> },
        { name: "Patient", path: "/admin/users", icon: <FiUser /> },
    ];

    const isActive = (path) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="a-dashboard-container">
            {/* Sidebar */}
            <aside className="a-sidebar">
                <div className="sidebar-header" style={{ marginBottom: '40px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#8b5cf6', color: 'white', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '10px' }}>C</div>
                        <span>CarePoint</span>
                    </div>
                </div>

                <nav className="a-sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`a-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="a-nav-icon">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                    <div className="a-nav-link" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ef4444' }}>
                        <FiLogOut className="a-nav-icon" />
                        <span>Logout</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="a-main-content">
                <header className="a-header">
                    <div className="a-header-user">
                        <FiGrid style={{ color: '#8b5cf6', fontSize: '1.2rem' }} />
                        <span style={{ fontWeight: 700 }}>Madhusha HMS Admin</span>
                    </div>

                    <div className="a-header-logo">
                        <span>MediLab Hospital</span>
                    </div>

                    <div className="a-header-user">
                        <span>Hi, {user?.name}</span>
                        <Notifications />
                        <img src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=8b5cf6&color=fff`} alt="admin" />
                    </div>
                </header>

                <div className="inner-content">
                    <Routes>
                        <Route path="/" element={<HomeStats stats={stats} />} />
                        <Route path="/doctors" element={<DoctorsManagement />} />
                        <Route path="/users" element={<UsersManagement />} />
                        <Route path="/lab" element={<ComingSoon feature="Lab Management" />} />
                        <Route path="/ward" element={<ComingSoon feature="Ward Management" />} />
                        <Route path="/treatment" element={<ComingSoon feature="Treatment Management" />} />
                        <Route path="/pharmacy" element={<PharmacyManagement />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

/* Mock Data for Charts */
const patientGrowthData = [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 1800 },
    { name: 'Wed', value: 1300 },
    { name: 'Thu', value: 2000 },
    { name: 'Fri', value: 1600 },
    { name: 'Sat', value: 2200 },
    { name: 'Sun', value: 1900 },
];

const HomeStats = ({ stats }) => {
    return (
        <div className="a-stats-wrapper">
            {/* Quick Stats Cards */}
            <div className="a-stats-row">
                <div className="a-stat-card">
                    <div className="a-stat-icon-box" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><FiUser /></div>
                    <div className="a-stat-info"><h4>Total Patients</h4><p>{stats?.totalPatients || 0}</p></div>
                </div>
                <div className="a-stat-card">
                    <div className="a-stat-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}><FiBriefcase /></div>
                    <div className="a-stat-info"><h4>Total Doctors</h4><p>{stats?.totalDoctors || 0}</p></div>
                </div>
                <div className="a-stat-card">
                    <div className="a-stat-icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}><FiHome /></div>
                    <div className="a-stat-info"><h4>Total Wards</h4><p>10</p></div>
                </div>
                <div className="a-stat-card">
                    <div className="a-stat-icon-box" style={{ background: '#fff7ed', color: '#f97316' }}><FiLayers /></div>
                    <div className="a-stat-info"><h4>Total Labs</h4><p>20</p></div>
                </div>
            </div>

            {/* Main Graphs & Appointments Area */}
            <div className="a-main-grid">
                <div className="a-card">
                    <div className="a-card-header">
                        <h3>Patient Registration Growth</h3>
                        <div className="a-badge pending">Last 7 Days</div>
                    </div>
                    <div className="chart-wrapper" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={patientGrowthData}>
                                <defs>
                                    <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorAdmin)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="a-card">
                    <div className="a-card-header"><h3>Appointments</h3><FiArrowRight style={{color: '#8b5cf6'}} /></div>
                    <div className="a-apt-list">
                        <div className="a-apt-item">
                            <div className="a-apt-user">
                                <img src="https://i.pravatar.cc/40?u=1" style={{borderRadius: '10px'}} />
                                <div><span>Chance Vaccaro</span><p className="a-apt-meta">10.11.2023 12:34</p></div>
                            </div>
                            <span className="a-badge pending">Pending</span>
                        </div>
                        <div className="a-apt-item">
                            <div className="a-apt-user">
                                <img src="https://i.pravatar.cc/40?u=2" style={{borderRadius: '10px'}} />
                                <div><span>Desirae Kenter</span><p className="a-apt-meta">04.10.2023 03:21</p></div>
                            </div>
                            <span className="a-badge rejected">Rejected</span>
                        </div>
                        <div className="a-apt-item">
                            <div className="a-apt-user">
                                <img src="https://i.pravatar.cc/40?u=3" style={{borderRadius: '10px'}} />
                                <div><span>Alinda Mini</span><p className="a-apt-meta">15.09.2023 11:54</p></div>
                            </div>
                            <span className="a-badge accepted">Accepted</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="a-bottom-grid">
                <div className="a-card a-table-card">
                    <div className="a-card-header"><h3>Recent Doctors</h3><span className="a-badge accepted">Online (3)</span></div>
                    <table className="a-table">
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>Mobile</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>1</td><td>Dr. Sam</td><td>0704702834</td><td><span className="a-status-dot online"></span>Online</td></tr>
                            <tr><td>2</td><td>Dr. John</td><td>0712392812</td><td><span className="a-status-dot online"></span>Online</td></tr>
                            <tr><td>3</td><td>Dr. Emma</td><td>0772834912</td><td><span className="a-status-dot offline"></span>Offline</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="a-card a-table-card">
                    <div className="a-card-header"><h3>Out of Stock (Pharmacy)</h3><span className="a-badge rejected">Critical (4)</span></div>
                    <table className="a-table">
                        <thead>
                            <tr><th>Drug Name</th><th>Price</th><th>QTY</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Amoxicillin</td><td>Rs. 1,200</td><td style={{color: '#ef4444'}}>12</td></tr>
                            <tr><td>Panadol</td><td>Rs. 250</td><td style={{color: '#ef4444'}}>45</td></tr>
                            <tr><td>Citrizine</td><td>Rs. 300</td><td style={{color: '#ef4444'}}>20</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PharmacyManagement = () => {
    return (
        <div className="a-stats-wrapper">
            <div className="a-card-header" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Pharmacy Management</h3>
            </div>

            {/* Pharmacy Metrics */}
            <div className="a-stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '30px' }}>
                <div className="a-stat-card" style={{ flexDirection: 'column', textAlign: 'center', gap: '5px' }}>
                    <h4 style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>Total Customer</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 800 }}>25</p>
                </div>
                <div className="a-stat-card" style={{ flexDirection: 'column', textAlign: 'center', gap: '5px' }}>
                    <h4 style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>Total Medicine</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 800 }}>25</p>
                </div>
                <div className="a-stat-card" style={{ flexDirection: 'column', textAlign: 'center', gap: '5px' }}>
                    <h4 style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>Total Manufactures</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 800 }}>25</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="a-stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '30px' }}>
                <button className="btn-admin" style={{ height: '80px', borderRadius: '16px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>Create Invoice</button>
                <button className="btn-admin" style={{ height: '80px', borderRadius: '16px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' }}>Supplier</button>
                <button className="btn-admin" style={{ height: '80px', borderRadius: '16px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>Medicine</button>
            </div>

            {/* Charts Section */}
            <div className="a-main-grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div className="a-card">
                    <div className="a-card-header"><h3>Purchase Reports</h3><span className="a-badge pending">7 Days</span></div>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={patientGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="a-card">
                    <div className="a-card-header"><h3>Sale Reports</h3><span className="a-badge accepted">All</span></div>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={[
                                        { name: 'Chrome', value: 40, fill: '#3b82f6' },
                                        { name: 'IE', value: 30, fill: '#fbbf24' },
                                        { name: 'Firefox', value: 20, fill: '#ef4444' },
                                        { name: 'Safari', value: 10, fill: '#10b981' }
                                    ]} 
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none"
                                />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="a-card" style={{ marginBottom: '30px' }}>
                <div className="a-card-header"><h3>Stock Reports</h3><span className="a-badge rejected">Low Stock</span></div>
                <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Mon', val: 400, color: '#38bdf8' },
                            { name: 'Tue', val: 700, color: '#fbbf24' },
                            { name: 'Wed', val: 600, color: '#ef4444' },
                            { name: 'Thu', val: 650, color: '#3b82f6' },
                            { name: 'Fri', val: 300, color: '#10b981' }
                        ]}>
                            <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                                { [0,1,2,3,4].map((e, i) => (
                                    <Cell key={i} fill={['#38bdf8', '#fbbf24', '#ef4444', '#3b82f6', '#10b981'][i]} />
                                )) }
                            </Bar>
                            <Tooltip cursor={{fill: 'transparent'}} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Out of Stock Table */}
            <div className="a-card a-table-card">
                <div className="a-card-header">
                    <h3>Out of Stock</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Critical inventory monitoring</p>
                </div>
                <table className="a-table">
                    <thead>
                        <tr><th>ID</th><th>Drug Name</th><th>Expire Date</th><th>Price</th><th>QTY</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>Vitamin-C</td><td>2024-04-12</td><td>$40.00</td><td>10</td><td><span className="a-badge" style={{ background: '#ecfdf5', color: '#10b981' }}>Available</span></td></tr>
                        <tr><td>2</td><td>Paracetamol</td><td>2024-08-15</td><td>$25.00</td><td style={{ color: '#ef4444', fontWeight: 700 }}>0</td><td><span className="a-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>Out Of Stock</span></td></tr>
                        <tr><td>3</td><td>Aspirin</td><td>2024-12-20</td><td>$15.00</td><td>50</td><td><span className="a-badge" style={{ background: '#ecfdf5', color: '#10b981' }}>Available</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ComingSoon = ({ feature }) => (
    <div className="a-card" style={{ textAlign: 'center', padding: '100px 0' }}>
        <FiActivity style={{ fontSize: '3rem', color: '#8b5cf6', marginBottom: '20px' }} />
        <h2>{feature}</h2>
        <p style={{ color: '#64748b' }}>We are currently building this section to provide you the best experience.</p>
    </div>
);

/* Doctors Management Component with new layout */
const DoctorsManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadDoctors(); }, []);
    const loadDoctors = async () => {
        try {
            const response = await adminService.getDoctors();
            setDoctors(response.data.data.doctors);
        } catch (error) { console.error(error); }
    };

    return (
        <div className="a-card">
            <div className="a-card-header">
                <h3>Staff Management</h3>
                <button onClick={() => setShowForm(!showForm)} className="btn-admin">
                    {showForm ? "Cancel" : "Add New Staff"}
                </button>
            </div>

            {showForm && <DoctorForm onSuccess={() => { setShowForm(false); loadDoctors(); }} />}

            <div style={{ overflowX: 'auto' }}>
                <table className="a-table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Specialization</th><th>Fee</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {doctors.map(doc => (
                            <tr key={doc._id}>
                                <td style={{ fontWeight: 600 }}>{doc.userId?.name}</td>
                                <td>{doc.userId?.email}</td>
                                <td>{doc.specialization}</td>
                                <td>Rs. {doc.consultationFee}</td>
                                <td>
                                    <span className="a-badge accepted" style={{ background: doc.userId?.status === 'active' ? '#ecfdf5' : '#fef2f2', color: doc.userId?.status === 'active' ? '#10b981' : '#ef4444' }}>
                                        {doc.userId?.status}
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

/* Doctor Form Wrapper */
const DoctorForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", specialization: "", licenseNumber: "", consultationFee: "", experience: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try { await adminService.createDoctor(formData); onSuccess(); }
        catch (err) { setError(err.response?.data?.message || "Failed to create staff"); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '20px' }}>Staff Enrollment</h4>
            {error && <div style={{ color: '#ef4444', marginBottom: '15px' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }} placeholder="Full Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }} placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <input style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }} type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <input style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px' }} placeholder="Specialization" onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} required />
                <button type="submit" disabled={loading} className="btn-admin" style={{ gridColumn: 'span 2' }}>
                    {loading ? "Registering..." : "Enroll Specialist"}
                </button>
            </form>
        </div>
    );
};

/* User Management with new layout */
const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [filterRole, setFilterRole] = useState("all");

    useEffect(() => { loadUsers(); }, []);
    const loadUsers = async () => {
        try {
            const response = await adminService.getUsers();
            setUsers(response.data.data.users);
        } catch (error) { console.error(error); }
    };

    const roles = ["all", "patient", "doctor", "admin"];
    const filteredUsers = filterRole === "all" 
        ? users 
        : users.filter(u => u.role === filterRole);

    return (
        <div className="a-card">
            <div className="a-card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
                <h3>User Management</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '12px',
                                border: 'none',
                                background: filterRole === role ? '#8b5cf6' : '#f1f5f9',
                                color: filterRole === role ? 'white' : '#64748b',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {role}s
                        </button>
                    ))}
                </div>
            </div>
            
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                <table className="a-table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? filteredUsers.map(u => (
                            <tr key={u._id}>
                                <td style={{ fontWeight: 600 }}>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '8px', 
                                        fontSize: '0.75rem', 
                                        background: u.role === 'admin' ? '#f5f3ff' : u.role === 'doctor' ? '#ecfdf5' : '#eff6ff',
                                        color: u.role === 'admin' ? '#8b5cf6' : u.role === 'doctor' ? '#10b981' : '#3b82f6',
                                        fontWeight: 700
                                    }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>{u.phone}</td>
                                <td>
                                    <span className={`a-badge ${u.status === 'active' ? 'accepted' : 'rejected'}`}>{u.status}</span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No {filterRole}s found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
