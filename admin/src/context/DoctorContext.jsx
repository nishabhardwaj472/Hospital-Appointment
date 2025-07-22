import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  const loginDoctor = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/doctor/login`, {
        email,
        password,
      });
      if (res.data.success) {
        setDToken(res.data.token);
        localStorage.setItem("dToken", res.data.token);
        toast.success("Login successful");
        return true;
      } else {
        toast.error(res.data.message || "Login failed");
        return false;
      }
    } catch (error) {
      toast.error("Login error");
      return false;
    }
  };

  const logoutDoctor = () => {
    setDToken("");
    localStorage.removeItem("dToken");
    setDoctor(null);
    setAppointments([]);
    setDashData(null);
    toast.info("Logged out");
  };

  const getAppointments = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (res.data.success) {
        setAppointments(res.data.appointments);
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      toast.error("Error fetching appointments");
    }
  };

  const getDashboard = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });

      if (res.data.success) {
        setDashData(res.data.data);
      } else {
        toast.error("Dashboard fetch failed");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Error loading dashboard");
    }
  };

  const getDoctorProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (res.data.success) {
        setDoctor(res.data.doctor);
      } else {
        toast.error(res.data.message || "Failed to load profile");
      }
    } catch (error) {
      toast.error("Profile fetch error");
    }
  };

  // ✅ Update doctor profile (like user)
  const updateDoctorProfile = async (updatedData, image = null) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedData.name || "");
      formData.append("phone", updatedData.phone || "");
      formData.append("address", JSON.stringify(updatedData.address || {}));
      formData.append("gender", updatedData.gender || "");
      formData.append("dob", updatedData.dob || "");
      formData.append("speciality", updatedData.speciality || "");
      formData.append("degree", updatedData.degree || "");
      formData.append("experience", updatedData.experience || "");
      formData.append("fees", updatedData.fees || "");

      if (image) formData.append("image", image);

      const res = await axios.put(`${backendUrl}/api/doctor/update-profile`, formData, {
        headers: { Authorization: `Bearer ${dToken}` },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully");
        setDoctor(res.data.doctor); // Update context
        return true;
      } else {
        toast.error(res.data.message || "Update failed");
        return false;
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
      return false;
    }
  };

  return (
    <DoctorContext.Provider
      value={{
        dToken,
        setDToken,
        doctor,
        setDoctor,
        appointments,
        getAppointments,
        dashData,
        getDashboard,
        loginDoctor,
        logoutDoctor,
        getDoctorProfile,
        updateDoctorProfile, // ✅ new
      }}
    >
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
