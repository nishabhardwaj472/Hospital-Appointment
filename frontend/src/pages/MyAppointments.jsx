import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-');
    return `${dateArray[2]} ${months[Number(dateArray[1]) - 1]} ${dateArray[0]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  const cancelAppointment = async (appointmentId, docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Appointment cancelled successfully');
        getUserAppointments();
        getDoctorsData();
        navigate(`/appointment/${docId}`, { state: { cancelled: true } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

      {appointments.length === 0 ? (
        <p className="text-gray-500 mt-4">You have no appointments yet.</p>
      ) : (
        <div>
          {appointments.map((item, index) => (
            <div
              className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'
              key={index}
            >
              <div>
                <img
                  className='w-32 bg-indigo-50 rounded-md'
                  src={item?.docData?.image}
                  alt="Doctor"
                />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item?.docData?.name}</p>
                <p>{item?.docData?.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item?.docData?.address?.line1}</p>
                <p className='text-xs'>{item?.docData?.address?.line2}</p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time :</span>{' '}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              <div className='flex flex-col gap-2 justify-end sm:items-end'>
                {item.cancelled ? (
                  <>
                    <span className='px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 border border-red-400'>
                      Cancelled
                    </span>
                    <button
                      onClick={() => navigate(`/appointment/${item.docId}`)}
                      className='text-sm text-white bg-primary text-center sm:min-w-48 py-2 border rounded hover:opacity-90 transition-all duration-300'
                    >
                      Book Again
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                      disabled
                    >
                      Pay Online
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this appointment?")) {
                          cancelAppointment(item._id, item.docId);
                        }
                      }}
                      className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
