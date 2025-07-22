import express from 'express';
import {
  loginDoctor,
  doctorList,
  getDoctorProfile,
  changeAvailability,
  appointmentsDoctor,
  cancelAppointment,
  dashboardDoctor,
  updateDoctorProfile, // ✅ new
} from '../controllers/doctorController.js';

import authDoctor from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js';

const doctorRouter = express.Router();

doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/list', doctorList);

doctorRouter.get('/profile', authDoctor, getDoctorProfile);
doctorRouter.post('/change-availability', authDoctor, changeAvailability);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/cancel-appointment', authDoctor, cancelAppointment);
doctorRouter.get('/dashboard', authDoctor, dashboardDoctor);

// ✅ New route to match user update logic
doctorRouter.put('/update-profile', authDoctor, upload.single('image'), updateDoctorProfile);

export default doctorRouter;
