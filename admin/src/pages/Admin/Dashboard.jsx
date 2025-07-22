import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { MdPeople, MdAssignment, MdPerson } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";

const Dashboard = () => {
  const { getDashData, dashData, getAllAppointments, appointments } = useContext(AdminContext);

  useEffect(() => {
    getDashData();
    getAllAppointments();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
          <FaUserDoctor className="text-blue-600 text-3xl" />
          <div>
            <p className="text-gray-500">Doctors</p>
            <h3 className="text-xl font-semibold">{dashData?.totalDoctors || 0}</h3>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
          <MdAssignment className="text-purple-600 text-3xl" />
          <div>
            <p className="text-gray-500">Appointments</p>
            <h3 className="text-xl font-semibold">{dashData?.totalAppointments || 0}</h3>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
          <MdPeople className="text-green-600 text-3xl" />
          <div>
            <p className="text-gray-500">Patients</p>
            <h3 className="text-xl font-semibold">{dashData?.totalPatients || 0}</h3>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Latest Bookings</h3>
        <ul className="space-y-3">
          {appointments?.slice(0, 5)?.map((appt, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={appt.doctorImage || "/doctor.png"}
                  alt="doctor"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    Dr. {appt.doctorName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Booking on {new Date(appt.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                {appt.status === "Cancelled" && (
                  <span className="text-red-500 font-semibold">Cancelled</span>
                )}
                {appt.status === "Completed" && (
                  <span className="text-green-500 font-semibold">Completed</span>
                )}
                {appt.status === "Pending" && (
                  <span className="text-yellow-500 font-semibold">Pending</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
