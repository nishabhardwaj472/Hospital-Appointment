import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5 font-sans'>
      {/* Dashboard Summary Cards */}
      <div className='flex flex-wrap gap-6'>
        <div className='flex items-center gap-4 bg-white min-w-[200px] p-4 rounded-2xl shadow hover:scale-[1.02] transition-all'>
          <img className='w-12 h-12' src={assets.doctor_icon} alt="Doctor Icon" />
          <div>
            <p className='text-2xl font-bold text-gray-700'>{dashData.doctors}</p>
            <p className='text-gray-500 text-sm'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white min-w-[200px] p-4 rounded-2xl shadow hover:scale-[1.02] transition-all'>
          <img className='w-12 h-12' src={assets.appointments_icon} alt="Appointments Icon" />
          <div>
            <p className='text-2xl font-bold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-500 text-sm'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white min-w-[200px] p-4 rounded-2xl shadow hover:scale-[1.02] transition-all'>
          <img className='w-12 h-12' src={assets.patients_icon} alt="Patients Icon" />
          <div>
            <p className='text-2xl font-bold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-500 text-sm'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white mt-10 rounded-2xl shadow'>
        <div className='flex items-center gap-3 px-6 py-4 border-b'>
          <img src={assets.list_icon} className='w-5 h-5' alt="List Icon" />
          <p className='text-lg font-semibold text-gray-700'>Latest Bookings</p>
        </div>

        <div className='divide-y'>
          {
            dashData.latestAppointments.map((item, index) => {
              let status = 'Booked';
              if (item.cancelled) status = 'Cancelled';
              else if (item.isCompleted) status = 'Completed';

              const statusColor = status === 'Cancelled'
                ? 'text-red-500'
                : status === 'Completed'
                  ? 'text-blue-500'
                  : 'text-green-600';

              // Convert date format to "6 July 2025"
              const readableDate = new Date(item.slotDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

              return (
                <div key={index} className='flex items-center gap-4 px-6 py-4'>
                  <img src={item.docData.image} alt="" className='w-12 h-12 rounded-full object-cover border' />
                  <div className='flex-1'>
                    <p className='font-medium text-gray-800'>{item.docData.name}</p>
                    <p className='text-sm text-gray-500'>{readableDate}</p>
                    <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
