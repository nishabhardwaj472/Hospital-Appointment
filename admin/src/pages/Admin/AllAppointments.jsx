import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, backendUrl } = useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      fetchAppointments();
    }
  }, [aToken]);

  const fetchAppointments = async () => {
    try {
      await getAllAppointments();
    } catch (err) {
      toast.error('Failed to fetch appointments');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      if (data.success) {
        toast.success('Appointment cancelled');
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('aToken');
        navigate('/admin-login');
      } else {
        toast.error('Cancel failed');
      }
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/complete-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        }
      );
      if (data.success) {
        toast.success('Appointment marked as completed');
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('aToken');
        navigate('/admin-login');
      } else {
        toast.error('Completion failed');
      }
    }
  };

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-semibold mb-4">All Appointments</h2>

      <div className="grid grid-cols-8 font-semibold border-b border-black py-3">
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Status</p>
        <p>Actions</p>
      </div>

      {appointments?.length === 0 ? (
        <p className="text-gray-500 mt-4">No appointments available.</p>
      ) : (
        appointments.map((app, index) => {
          const patientName = app.userData?.name || 'N/A';
          const patientDob = app.userData?.dob;
          const doctorName = app.docData?.name || 'N/A';
          const doctorFees = app.docData?.fees != null ? `₹${app.docData.fees}` : '₹N/A';
          const dateStr = new Date(app.date).toLocaleDateString();
          const timeStr = app.slotTime || 'N/A';

          let age = 'N/A';
          try {
            if (patientDob) {
              const parsedDOB = new Date(patientDob);
              if (!isNaN(parsedDOB.getTime())) {
                age = calculateAge(parsedDOB);
              }
            }
          } catch (err) {
            console.warn('Invalid DOB format:', patientDob);
          }

          let status = 'Booked';
          if (app.cancelled) status = 'Cancelled';
          else if (app.isCompleted) status = 'Completed';

          const statusColor =
            status === 'Cancelled'
              ? 'text-red-600'
              : status === 'Completed'
              ? 'text-blue-600'
              : 'text-green-600';

          return (
            <div
              key={app._id}
              className="grid grid-cols-8 items-center py-3 border-b border-gray-300 text-sm"
            >
              <p>{index + 1}</p>
              <p>{patientName}</p>
              <p>{age}</p>
              <p className="flex flex-col">
                <span>{dateStr}</span>
                <span className="text-xs text-gray-600">{timeStr}</span>
              </p>
              <p>{doctorName}</p>
              <p>{doctorFees}</p>
              <p className={`font-semibold ${statusColor}`}>{status}</p>
              <div className="flex gap-2">
                {!app.cancelled && !app.isCompleted && (
                  <>
                    <button
                      onClick={() => handleCancel(app._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleComplete(app._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Complete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AllAppointments;
