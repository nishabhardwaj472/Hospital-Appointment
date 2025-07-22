import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("aToken", aToken);
  }, [aToken]);

  // =============================
  // Handle Unauthorized globally
  const handleAuthError = () => {
    toast.error("Session expired. Please login again.");
    setAToken("");
    localStorage.removeItem("aToken");
    navigate("/admin-login");
  };

  // =============================
  // Get all doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || "Failed to fetch doctors.");
      }
    } catch (error) {
      if (error.response?.status === 401) return handleAuthError();
      toast.error(error.response?.data?.message || "Error loading doctors");
    }
  };

  // =============================
  // Toggle doctor availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors(); // refresh list
      } else {
        toast.error(data.message || "Failed to change availability.");
      }
    } catch (error) {
      if (error.response?.status === 401) return handleAuthError();
      toast.error(error.response?.data?.message || "Availability change failed");
    }
  };

  // =============================
  // Get all appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message || "Failed to fetch appointments.");
      }
    } catch (error) {
      if (error.response?.status === 401) return handleAuthError();
      toast.error(error.response?.data?.message || "Error loading appointments");
    }
  };

  // =============================
  // Get dashboard data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data.success) {
        setDashData(data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) return handleAuthError();
      toast.error("Failed to load dashboard");
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    setDoctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    dashData,
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
