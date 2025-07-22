import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dToken, doctor, setDoctor, getDoctorProfile } = useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (dToken) getDoctorProfile();
  }, [dToken]);

  const updateDoctorProfileData = async () => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('name', doctor.name);
      formData.append('phone', doctor.phone);
      formData.append('gender', doctor.gender);
      formData.append('dob', doctor.dob);
      formData.append('speciality', doctor.speciality);
      formData.append('degree', doctor.degree);
      formData.append('experience', doctor.experience);
      formData.append('fees', doctor.fees);
      formData.append('about', doctor.about);
      formData.append('address', JSON.stringify(doctor.address));
      if (image) formData.append('image', image);

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      if (res.data.success) {
        toast.success('Profile updated');
        getDoctorProfile();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!doctor) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <div className="flex flex-col items-center gap-4">
        {isEdit ? (
          <label htmlFor="image" className="relative cursor-pointer">
            <img
              className="w-36 h-36 object-cover rounded-full border-4 border-primary shadow"
              src={image ? URL.createObjectURL(image) : doctor.image}
              alt="Profile"
            />
            <img
              className="w-8 h-8 absolute bottom-0 right-2 bg-white rounded-full p-1 shadow"
              src={image ? '' : assets.upload_icon}
              alt="Upload"
            />
            <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>
        ) : (
          <img
            className="w-36 h-36 object-cover rounded-full border-4 border-primary shadow"
            src={doctor.image}
            alt="Profile"
          />
        )}

        {isEdit ? (
          <input
            className="text-2xl font-semibold text-center border-b pb-1"
            value={doctor.name}
            onChange={(e) => setDoctor((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <h1 className="text-2xl font-semibold text-gray-800 text-center">{doctor.name}</h1>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-600 border-b pb-1 mb-4">CONTACT INFORMATION</h2>
        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm text-gray-700">
          <span className="font-medium">Email:</span>
          <span className="text-blue-600">{doctor.email}</span>

          <span className="font-medium">Phone:</span>
          {isEdit ? (
            <input
              className="bg-gray-100 px-2 py-1 rounded"
              value={doctor.phone}
              onChange={(e) => setDoctor((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <span>{doctor.phone}</span>
          )}

          <span className="font-medium">Address:</span>
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <input
                className="bg-gray-100 px-2 py-1 rounded"
                value={doctor.address?.line1 || ''}
                onChange={(e) =>
                  setDoctor((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <input
                className="bg-gray-100 px-2 py-1 rounded"
                value={doctor.address?.line2 || ''}
                onChange={(e) =>
                  setDoctor((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </div>
          ) : (
            <span>
              {doctor.address?.line1}
              <br />
              {doctor.address?.line2}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-600 border-b pb-1 mb-4">BASIC INFORMATION</h2>
        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm text-gray-700">
          <span className="font-medium">Gender:</span>
          {isEdit ? (
            <select
              className="bg-gray-100 px-2 py-1 rounded"
              value={doctor.gender}
              onChange={(e) => setDoctor((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          ) : (
            <span>{doctor.gender}</span>
          )}

          <span className="font-medium">Birthday:</span>
          {isEdit ? (
            <input
              type="date"
              className="bg-gray-100 px-2 py-1 rounded"
              value={doctor.dob}
              onChange={(e) => setDoctor((prev) => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <span>{doctor.dob}</span>
          )}

          <span className="font-medium">Speciality:</span>
          {isEdit ? (
            <input
              className="bg-gray-100 px-2 py-1 rounded"
              value={doctor.speciality}
              onChange={(e) => setDoctor((prev) => ({ ...prev, speciality: e.target.value }))}
            />
          ) : (
            <span>{doctor.speciality}</span>
          )}

          <span className="font-medium">Degree:</span>
          {isEdit ? (
            <input
              className="bg-gray-100 px-2 py-1 rounded"
              value={doctor.degree}
              onChange={(e) => setDoctor((prev) => ({ ...prev, degree: e.target.value }))}
            />
          ) : (
            <span>{doctor.degree}</span>
          )}

          <span className="font-medium">Experience:</span>
          {isEdit ? (
            <input
              type="text"
              className="bg-gray-100 px-2 py-1 rounded"
              value={doctor.experience}
              onChange={(e) => setDoctor((prev) => ({ ...prev, experience: e.target.value }))}
            />
          ) : (
            <span>{doctor.experience}</span>
          )}

          <span className="font-medium">Fees:</span>
          {isEdit ? (
            <input
              type="number"
              className="bg-gray-100 px-2 py-1 rounded"
              value={doctor.fees}
              onChange={(e) => setDoctor((prev) => ({ ...prev, fees: e.target.value }))}
            />
          ) : (
            <span>₹{doctor.fees}</span>
          )}

          <span className="font-medium">About:</span>
          {isEdit ? (
            <textarea
              className="bg-gray-100 px-2 py-1 rounded resize-none"
              rows={4}
              value={doctor.about}
              onChange={(e) => setDoctor((prev) => ({ ...prev, about: e.target.value }))}
            />
          ) : (
            <span className="whitespace-pre-wrap">{doctor.about}</span>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        {isEdit ? (
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              isUpdating
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={updateDoctorProfileData}
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        ) : (
          <button
            className="px-6 py-2 rounded-full text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
