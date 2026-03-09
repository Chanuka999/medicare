import axios from "axios";

const API_URL = "/api";

const isValidJwtToken = (token) => {
  if (!token || token === "undefined" || token === "null") return false;
  return token.split(".").length === 3;
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (isValidJwtToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      localStorage.removeItem("token");
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, clear the invalid token
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        // Only reload if we're not already on an auth page
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authService = {
  register: (userData) => apiClient.post("/auth/register", userData),
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  getMe: () => apiClient.get("/auth/me"),
};

// Admin API
export const adminService = {
  getUsers: (params) => apiClient.get("/admin/users", { params }),
  updateUserStatus: (id, status) =>
    apiClient.patch(`/admin/users/${id}/status`, { status }),
  createDoctor: (doctorData) => apiClient.post("/admin/doctors", doctorData),
  getDoctors: () => apiClient.get("/admin/doctors"),
  updateDoctor: (id, data) => apiClient.patch(`/admin/doctors/${id}`, data),
  getDashboardStats: () => apiClient.get("/admin/dashboard/stats"),
};

// Patient API
export const patientService = {
  getDoctors: (params) => apiClient.get("/patient/doctors", { params }),
  bookAppointment: (appointmentData) =>
    apiClient.post("/patient/appointments", appointmentData),
  getMyAppointments: () => apiClient.get("/patient/appointments"),
  cancelAppointment: (id, reason) =>
    apiClient.patch(`/patient/appointments/${id}/cancel`, {
      cancellationReason: reason,
    }),
  getMyMedicalRecords: () => apiClient.get("/patient/medical-records"),
};

// Doctor API
export const doctorService = {
  getProfile: () => apiClient.get("/doctor/profile"),
  updateAvailability: (availability) =>
    apiClient.patch("/doctor/availability", { availability }),
  getMyAppointments: (params) =>
    apiClient.get("/doctor/appointments", { params }),
  updateAppointmentStatus: (id, status) =>
    apiClient.patch(`/doctor/appointments/${id}/status`, { status }),
  createMedicalRecord: (recordData) =>
    apiClient.post("/doctor/medical-records", recordData),
  getPatientHistory: (patientId) =>
    apiClient.get(`/doctor/patients/${patientId}/medical-history`),
};

// Billing API
export const billingService = {
  createBill: (billData) => apiClient.post("/billing", billData),
  getAllBills: (params) => apiClient.get("/billing", { params }),
  getMyBills: () => apiClient.get("/billing/my-bills"),
  getBill: (id) => apiClient.get(`/billing/${id}`),
  updatePayment: (id, paymentData) =>
    apiClient.patch(`/billing/${id}/payment`, paymentData),
};

export default apiClient;
