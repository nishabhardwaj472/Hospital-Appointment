import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const handleCancel = async (appointmentId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getAppointments();
      } else {
        toast.error(res.data.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Error cancelling appointment');
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getAppointments();
      } else {
        toast.error(res.data.message || 'Failed to mark as completed');
      }
    } catch (err) {
      console.error('Complete error:', err);
      toast.error('Error completing appointment');
    }
  };

  return (
    <div className="m-5 font-sans">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">My Appointments</h2>

      {!appointments || appointments.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No appointments found.</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((item, index) => {
            const user = item.userData || {};
            const userName = user.name || 'User';
            const userImage = user.image || assets.user_icon;
            const userDOB = user.dob;
            const age = userDOB ? `${calculateAge(userDOB)} years` : 'N/A';

            const slotDate = new Date(item.slotDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            let statusText = 'Booked';
            let statusColor = 'text-green-600';

            if (item.cancelled || item.status === 'cancelled') {
              statusText = 'Cancelled';
              statusColor = 'text-red-500';
            } else if (item.isCompleted || item.status === 'completed') {
              statusText = 'Completed';
              statusColor = 'text-blue-500';
            }

            return (
              <div
                key={item._id || index}
                className="bg-white rounded-2xl shadow p-5 flex items-center gap-6"
              >
                <img
                  src={userImage}
                  alt={userName}
                  className="w-16 h-16 rounded-full object-cover border"
                />

                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-500">Age: {age}</p>
                  <p className="text-sm text-gray-500">
                    Date: {slotDate} at {item.slotTime}
                  </p>
                  <p className={`text-sm font-semibold ${statusColor}`}>{statusText}</p>
                </div>

                {!item.cancelled && !item.isCompleted && item.status !== 'cancelled' && item.status !== 'completed' && (
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm shadow"
                      onClick={() => handleCancel(item._id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm shadow"
                      onClick={() => handleComplete(item._id)}
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
