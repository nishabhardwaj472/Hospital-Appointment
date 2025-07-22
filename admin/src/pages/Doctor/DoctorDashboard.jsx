import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashboard } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashboard();
    }
  }, [dToken]);

  if (!dashData || !dashData.stats || !dashData.doctor || !dashData.latestAppointments) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  const { stats, doctor, latestAppointments } = dashData;

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Welcome, Dr. {doctor.name}
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <img src={assets.appointments_icon} className="w-10 h-10" alt="Active Appointments" />
          <div>
            <p className="text-xl font-bold text-blue-600">{stats.active}</p>
            <p className="text-sm text-gray-500">Active Appointments</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <img src={assets.appointments_icon} className="w-10 h-10" alt="Total Appointments" />
          <div>
            <p className="text-xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Appointments</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <img src={assets.patients_icon} className="w-10 h-10" alt="Patients" />
          <div>
            <p className="text-xl font-bold text-gray-800">{stats.patients}</p>
            <p className="text-sm text-gray-500">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Latest Bookings</h3>

        <ul className="divide-y divide-gray-200">
          {latestAppointments.map((appointment, index) => (
            <li key={index} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={appointment.userImage || assets.default_user}
                  alt="Patient"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{appointment.userName}</p>
                  <p className="text-sm text-gray-500">Booking on {appointment.date}</p>
                </div>
              </div>
              <div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    appointment.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorDashboard;
