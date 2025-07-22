import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);

  // ✅ Fetch all doctors
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ✅ Load user profile when token is available
  const loadUserProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { token },
      });

      if (data.success) {
        // Force a re-render with new object
        setUserData({ ...data.userData });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile.");
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserData(null);
    toast.success("Logged out successfully");
    navigate('/login');
  };

  // 🔄 Load doctors once
  useEffect(() => {
    getDoctorsData();
  }, []);

  // 🔄 Load user profile when token changes
  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setUserData(null);
    }
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    getDoctorsData,
    token,
    setToken,
    backendUrl,
    logout,
    userData,
    setUserData,
    loadUserProfile,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
