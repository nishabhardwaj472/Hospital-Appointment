import express from 'express';
import {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  cancelAppointment,
  completeAppointment,
  adminDashbord,
  changeAvailability // ✅ make sure this is imported
} from '../controllers/adminController.js';

import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

// Public Route
adminRouter.post('/login', loginAdmin);

// Protected Routes
adminRouter.post('/all-doctors', authAdmin, allDoctors);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);
adminRouter.put('/cancel-appointment', authAdmin, cancelAppointment);
adminRouter.put('/complete-appointment', authAdmin, completeAppointment);
adminRouter.get('/dashboard', authAdmin, adminDashbord);
adminRouter.post('/change-availability', authAdmin, changeAvailability); // ✅ route added here

export default adminRouter;
